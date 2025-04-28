import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const listRules = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const rules = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return rules?.ai_rules || [];
  },
});

export const upsertRule = mutation({
  args: {
    userId: v.id("users"),
    rules: v.array(
      v.object({
        id: v.string(),
        value: v.string(),
        type: v.union(v.literal("input"), v.literal("textarea")),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userSettings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!userSettings) {
      // Initialize record
      await ctx.db.insert("settings", {
        folders: [],
        categories: [],
        userId: args.userId,
        ai_rules: args.rules,
      });
      return;
    }

    await ctx.db.patch(userSettings._id, {
      ai_rules: args.rules,
    });
  },
});

export const listFolders = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const rules = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return rules?.folders || [];
  },
});

export const upsertFolders = mutation({
  args: {
    userId: v.id("users"),
    folders: v.array(
      v.object({
        id: v.string(),
        name: v.string(), // folder name
        description: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userSettings = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!userSettings) {
      // Initialize record
      await ctx.db.insert("settings", {
        ai_rules: [],
        categories: [],
        userId: args.userId,
        folders: args.folders,
      });
      return;
    }

    await ctx.db.patch(userSettings._id, {
      folders: args.folders,
    });
  },
});

export const storeDomainAnalytics = mutation({
  args: {
    service_url: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingRecord = await ctx.db
      .query("domains")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("service_url"), args.service_url)
        )
      )
      .first();

    if (existingRecord) {
      await ctx.db.patch(existingRecord._id, {
        count: existingRecord.count + 1,
      });
      return existingRecord._id;
    }

    const record = await ctx.db.insert("domains", {
      service_url: args.service_url,
      userId: args.userId,
      count: 1,
    });

    return record;
  },
});

export const listDomainAnalytics = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const domains = await ctx.db
      .query("domains")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    return domains;
  },
});

export const storeCategoryAnalytics = mutation({
  args: {
    emailId: v.string(),
    userId: v.id("users"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const existingRecord = await ctx.db
      .query("categories")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("emailId"), args.emailId)
        )
      )
      .first();

    if (existingRecord) {
      await ctx.db.patch(existingRecord._id, {
        count: existingRecord.count + 1,
      });
      return existingRecord._id;
    }

    const record = await ctx.db.insert("categories", {
      emailId: args.emailId,
      userId: args.userId,
      title: args.title,
      count: 1,
    });

    return record;
  },
});

export const listCategorySettings = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const rules = await ctx.db
      .query("settings")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return rules?.categories || [];
  },
});

export const listCategoryAnalytics = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const domains = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);

    return domains;
  },
});
