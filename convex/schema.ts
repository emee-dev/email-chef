import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  settings: defineTable({
    userId: v.id("users"),
    // For AI to easily classify emails based on user values
    categories: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
      })
    ),
    // For AI to easily contextualise folders
    folders: v.array(
      v.object({
        id: v.string(),
        name: v.string(), // folder name
        description: v.string(),
      })
    ),

    ai_rules: v.optional(
      v.array(
        v.object({
          id: v.string(),
          value: v.string(),
          type: v.union(v.literal("input"), v.literal("textarea")),
        })
      )
    ),
  }),

  subscriptions: defineTable({
    userId: v.id("users"),
    service_name: v.string(),
    service_url: v.string(),
    icon_url: v.optional(v.string()),
    billing_cycle: v.optional(v.string()),
    plan: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    renewal_date: v.optional(v.string()), // Assuming ISO string
    payment_method: v.optional(v.string()),
    email_subject: v.string(),
    email_body: v.string(),
    email_received_at: v.string(), // ISO string
    tags: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_tags", ["userId", "tags"]),

  // Analytics for domains that email the most.
  domains: defineTable({
    service_url: v.string(),
    userId: v.id("users"),
    count: v.number(),
  }),

  // The types of emails that are being recieved for analytics
  categories: defineTable({
    title: v.string(), // eg Marketing,
    count: v.number(),
    emailId: v.string(),
    userId: v.id("users"),
  }),

  // This table is used to keep track of users who've linked their email to unipile
  integrations: defineTable({
    userId: v.id("users"),
    accountId: v.optional(v.string()),
    email: v.optional(v.string()),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
