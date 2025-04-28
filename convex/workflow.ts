import { v } from "convex/values";
import { workflow } from ".";
import { api, internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const kickoffWebhookWorkflow = mutation({
  args: { email_html: v.string(), account_id: v.string(), subject: v.string() },
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

export type SubscriptionEmailObject = {
  userId: string;
  service_name: string; // ex: "Netflix"
  service_url: string; // ex: "https://www.netflix.com"
  icon_url?: string; // optional: use favicon as fallback
  billing_cycle?: "monthly" | "yearly" | "weekly" | string;
  plan?: string; // ex: "Premium", "Basic Plan"
  amount?: number; // ex: 9.99 (stored as number)
  currency?: string; // ex: "USD", "EUR"
  renewal_date?: string; // ISO date if parseable
  payment_method?: string; // ex: "Visa ending in 1234"
  email_subject: string; // raw subject
  email_body: string; // raw or cleaned body
  email_received_at: string; // ISO timestamp
  tags?: string[]; // ex: ["renewal", "invoice", "auto-renew"]
};

export const handleEmailWorkflow = workflow.define({
  args: {
    workflowId: v.string(),
    account_id: v.string(),
    email_html: v.string(),
    subject: v.string(),
  },
  handler: async (step, args) => {
    const user: User | null = await step.runQuery(api.integrations.getUserId, {
      accountId: args.account_id,
    });

    if (!user) {
      throw new Error("User not found, exiting workflow.");
    }

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
        }
      );

      await step.runMutation(api.subscriptions.create, subscription);
      await step.runMutation(api.webhook.storeDomainAnalytics, {
        userId: user.userId,
        service_url: subscription.service_url,
      });
    }

    // TODO Classify email and store as analytics

    // TODO execute user stored rules/prompts
    await step.runQuery(api.webhook.listRules, {
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
