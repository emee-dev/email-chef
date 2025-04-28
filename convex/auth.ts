import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

export const isConnected = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("integrations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!record) {
      return false;
    }

    if (!record.accountId || record.accountId === undefined) {
      return false;
    }

    return true;
  },
});
