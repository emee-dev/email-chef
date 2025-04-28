import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    accountId: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const db = await ctx.db.insert("integrations", {
      userId: args.userId,
      accountId: args.accountId,
      email: args.email,
    });

    if (!db) {
      return null;
    }

    return db;
  },
});

export const getUserId = query({
  args: {
    accountId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("integrations")
      .filter((q) => q.eq(q.field("accountId"), args.accountId))
      .first();

    return record;
  },
});

export const getUserAccountId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("integrations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return record;
  },
});
