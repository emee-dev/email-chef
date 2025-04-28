"use node";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { v } from "convex/values";
import { UnipileClient } from "unipile-node-sdk";
import { z } from "zod";
import { action, internalAction } from "./_generated/server";
import { SubscriptionEmailObject } from "./workflow";

const unipile = new UnipileClient(
  `https://${process.env.UNIPILE_DSN}`,
  process.env.UNIPILE_API_TOKEN as string
);

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google("gemini-1.5-pro");

// TODO implement this function
export const isSubscription = internalAction({
  args: { email_html: v.string() },
  handler: async (ctx, args) => {
    return { isSubscription: true };
  },
});

// TODO implement this function
export const emailToObject = internalAction({
  args: {
    email_html: v.string(),
    subject: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return null as unknown as SubscriptionEmailObject;
  },
});

export const runModel = action({
  args: { input: v.string() },
  handler: async (ctx, args) => {
    const { object } = await generateObject({
      temperature: 0.8,
      schema: z.object({
        joke: z.string().describe("The joke."),
      }),
      model,
      prompt: `${args.input}`,
      system: "You are an AI bot that tells jokes.",
    });

    console.log("AI joke: ", object);

    return object;
  },
});

export const sendEmail = action({
  args: {
    account_id: v.string(),
    body: v.string(),
    subject: v.string(),
    from_email: v.string(),
    from_name: v.string(),
    to_name: v.string(),
    to_email: v.string(),
  },
  handler: async (ctx, args) => {
    const e = await unipile.email.send({
      body: args.body,
      subject: args.subject,
      account_id: args.account_id,
      from: {
        display_name: args.from_name,
        identifier: args.from_email,
      },
      to: [
        {
          display_name: args.to_name,
          identifier: args.to_email,
        },
      ],
    });

    console.log("AI joke: ", e);

    return e;
  },
});
