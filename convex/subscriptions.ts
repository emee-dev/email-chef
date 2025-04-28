import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("subscriptions", {
      ...args,
      userId,
    });
  },
});

export const list = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) return [];

    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId as Id<"users">))
      // .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const listByTags = query({
  args: { tags: v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get all subscriptions for the user
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Filter for subscriptions that contain ANY of the requested tags
    return subscriptions.filter((sub) =>
      args.tags.some((tag) => (sub.tags ? sub.tags.includes(tag) : []))
    );
  },
});

export const update = mutation({
  args: {
    id: v.id("subscriptions"),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...update } = args;
    const existing = await ctx.db.get(id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Not found or unauthorized");
    }

    return await ctx.db.patch(id, update);
  },
});

export const remove = mutation({
  args: { id: v.id("subscriptions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.userId !== userId) {
      throw new Error("Not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
