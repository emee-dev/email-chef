import { v } from "convex/values";
import { workflow } from ".";
import { api, internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { SubscriptionEmailObject } from "./utils";

export const kickoffWebhookWorkflow = mutation({
  args: {
    email_html: v.string(),
    account_id: v.string(),
    subject: v.string(),
    sender_email: v.string(),
    sender_name: v.string(),
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
        workflowId: titleGenerationWorkflowId,
        account_id: args.account_id,
        email_html: args.email_html,
        subject: args.subject,
        sender_email: args.sender_email,
        sender_name: args.sender_name,
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
          email_html: args.email_html,
          subject: args.subject,
          userId: user.userId,
          sender_email: args.sender_email,
        }
      );

      // Categorize Email

      await step.runMutation(api.subscriptions.create, subscription);
      await step.runMutation(api.webhook.storeDomainAnalytics, {
        userId: user.userId,
        service_url: subscription.service_url,
      });
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

    // const transcript: string = await step.runAction(
    //   internal.transcripts.getYoutubeTranscript,
    //   {
    //     url: args.url,
    //   }
    // );

    // const summary: string = await step.runAction(
    //   internal.transcripts.generateSummary,
    //   {
    //     transcript: transcript,
    //   }
    // );

    // const titlePool: string[][] = await Promise.all([
    //   step.runAction(internal.agents.storyTellingAgent, {
    //     summary: summary,
    //   }),
    //   step.runAction(internal.agents.theoAgent, {
    //     summary: summary,
    //   }),
    //   step.runAction(internal.agents.dataAgent, {
    //     summary: summary,
    //   }),
    //   step.runAction(internal.agents.questionAgent, {
    //     summary: summary,
    //   }),
    //   step.runAction(internal.agents.howToAgent, {
    //     summary: summary,
    //   }),
    //   step.runAction(internal.agents.listicleAgent, {
    //     summary: summary,
    //   }),
    // ]);

    // const allTitles = titlePool.flat();

    // const reviews = (
    //   await Promise.all(
    //     allTitles.map((title) =>
    //       step.runAction(internal.reviewers.engagementReviewer, {
    //         title: title,
    //         summary: summary,
    //         workflowId: args.workflowId,
    //       })
    //     )
    //   )
    // ).filter((review) => review !== undefined) as ReviewType[];

    // let rewrites = 0;
    // let currentReviews: typeof reviews = [...reviews];
  },
});
