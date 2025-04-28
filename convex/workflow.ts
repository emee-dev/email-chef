import { v } from "convex/values";
import { workflow } from ".";
import { api, internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { SubscriptionEmailObject } from "./utils";

export const kickoffWebhookWorkflow = mutation({
  args: {
    subject: v.string(),
    email_id: v.string(),
    account_id: v.string(),
    email_html: v.string(),
    provider_id: v.string(),
    sender_name: v.string(),
    sender_email: v.string(),
    email_plain_text: v.string(),
    emailIdentifier: v.string(), // for interacting with unipile API
  },
  handler: async (ctx, args) => {
    const titleGenerationWorkflowId = Math.random()
      .toString(36)
      .substring(2, 15);

    const workflowId: string = await workflow.start(
      ctx,
      internal.workflow.handleEmailWorkflow,
      {
        subject: args.subject,
        email_id: args.email_id,
        email_html: args.email_html,
        account_id: args.account_id,
        provider_id: args.provider_id,
        sender_name: args.sender_name,
        sender_email: args.sender_email,
        workflowId: titleGenerationWorkflowId,
        email_plain_text: args.email_plain_text,
      }
    );

    return titleGenerationWorkflowId;
  },
});

type User = {
  _id: Id<"integrations">;
  _creationTime: number;
  accountId?: string | undefined;
  email?: string | undefined;
  userId: Id<"users">;
};

export const handleEmailWorkflow = workflow.define({
  args: {
    email_id: v.string(),
    provider_id: v.string(),
    workflowId: v.string(),
    account_id: v.string(),
    email_html: v.string(),
    subject: v.string(),
    sender_email: v.string(),
    sender_name: v.string(),
    email_plain_text: v.string(),
  },
  handler: async (step, args) => {
    const user: User | null = await step.runQuery(api.integrations.getUserId, {
      accountId: args.account_id,
    });

    if (!user) {
      throw new Error("User not found, exiting workflow.");
    }

    if (!user.email) {
      throw new Error("User email not found, exiting workflow.");
    }

    // It sort of helps in categorizing emails
    const userDefinedCategories = await step.runQuery(
      api.webhook.listCategorySettings,
      {
        userId: user.userId,
      }
    );

    const { isSubscription }: { isSubscription: boolean } =
      await step.runAction(internal.agent.isSubscription, {
        email_html: args.email_html,
      });

    if (isSubscription) {
      const subscription: SubscriptionEmailObject = await step.runAction(
        internal.agent.emailToObject,
        {
          userId: user.userId,
          subject: args.subject,
          email_html: args.email_html,
          sender_email: args.sender_email,
        }
      );

      // Categorize Email
      await Promise.all([
        step.runMutation(api.subscriptions.create, subscription),
        step.runMutation(api.webhook.storeDomainAnalytics, {
          userId: user.userId,
          service_url: subscription.service_url,
        }),
      ]);
    }

    // TODO Classify email and store as analytics
    const result = await step.runAction(internal.agent.categorizeEmail, {
      email_text: args.email_plain_text,
      user_categories: userDefinedCategories,
    });

    await step.runMutation(api.webhook.storeCategoryAnalytics, {
      emailId: args.sender_email, // email of the sender
      title: result.category,
      userId: user.userId,
    });

    // TODO execute user stored rules/prompts
    const rules = await step.runQuery(api.webhook.listRules, {
      userId: user.userId,
    });

    await step.runAction(api.agent.aiAutomation, {
      email_id: args.email_id,
      account_id: args.account_id,
      provider_id: args.provider_id,
      sender_email: user.email as string,
      email_subject: args.subject,
      email_content: args.email_plain_text,
      recipient_email: args.sender_email,
      prompts: rules.map((rule) => rule.value),
    });
  },
});
