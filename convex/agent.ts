"use node";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { v } from "convex/values";
import { UnipileClient } from "unipile-node-sdk";
import { z } from "zod";
import { action, internalAction } from "./_generated/server";
import * as cheerio from "cheerio";
import { tool } from "ai";
import {
  getAllImgs,
  getAllLinks,
  getVisibleText,
  SubscriptionEmailObject,
} from "./utils";

const unipile = new UnipileClient(
  `https://${process.env.UNIPILE_DSN}`,
  process.env.UNIPILE_API_TOKEN as string
);

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google("gemini-1.5-pro");

// Tools

const replyToAnEmail = tool({
  parameters: z.object({
    account_id: z.string().describe("Account ID of the sender."),
    provider_id: z
      .string()
      .describe(
        "Unique identifier for the email to reply to, in JSON stringified form."
      ),
    recipient_email: z.string().describe("Email address of the recipient."),
    email_subject: z.string().describe("Subject of the email to send."),
    email_body: z
      .string()
      .describe("Body of the email to be sent, in plain text (no HTML)."),
  }),
  execute: async ({
    account_id,
    email_body,
    email_subject,
    recipient_email,
    provider_id,
  }) => {
    try {
      const replyAction = await unipile.email.send({
        account_id,
        body: email_body,
        subject: email_subject,
        to: [{ identifier: recipient_email }],
        reply_to: provider_id,
      });

      return replyAction;
    } catch (error: any) {
      console.error(error);
      return `Error replying to email: ${error.message}`;
    }
  },
});

const sendAnEmail = tool({
  parameters: z.object({
    account_id: z.string().describe("Account ID of the sender."),
    recipient_email: z.string().describe("Email address of the recipient."),
    email_subject: z.string().describe("Subject of the email to send."),
    email_body: z
      .string()
      .describe("Body of the email to be sent, in plain text (no HTML)."),
  }),
  execute: async ({
    account_id,
    email_body,
    email_subject,
    recipient_email,
  }) => {
    try {
      const sendAction = await unipile.email.send({
        account_id,
        to: [{ identifier: recipient_email }],
        subject: email_subject,
        body: email_body,
      });

      return sendAction;
    } catch (error: any) {
      console.error(error);
      return `Error sending email: ${error.message}`;
    }
  },
});

const deleteAnEmail = tool({
  parameters: z.object({
    email_id: z.string().describe("Unique ID of the email to be deleted."),
  }),
  execute: async ({ email_id }) => {
    try {
      const deleteAction = await unipile.email.delete(email_id);

      return deleteAction;
    } catch (error: any) {
      console.error(error);
      return `Error deleting email: ${error.message}`;
    }
  },
});

export const isSubscription = internalAction({
  args: { email_html: v.string() },
  handler: async (ctx, args) => {
    const $ = cheerio.load(args.email_html);
    const emailBody = getVisibleText($("body"), $);
    const emailLinks = getAllLinks($);
    const emailImgs = getAllImgs($);

    // 1. Keyword check to decide if it's likely a subscription email
    const subscriptionKeywords = [
      "billing",
      "billed",
      "subscription",
      "plan",
      "renewal",
      "payment",
      "charged",
      "invoice",
      "monthly",
      "yearly",
      "annually",
      "next payment",
    ];

    const { object } = await generateObject({
      temperature: 0.8,
      schema: z.object({
        isSubscription: z
          .boolean()
          .describe(
            "Should be true if related to subscription or reoccuring payment."
          ),
      }),
      model,
      prompt: `
    You are helping build a subscription tracking tool.
    Identify subscription-related information from the provided email text.
    Look for keywords like "billed monthly", "subscription", "payment", etc.
    Your job is to structure the email into the provided object schema.

    Email Text: \`${emailBody}\`
    Links: ${JSON.stringify(emailLinks)}
    Images: ${JSON.stringify(emailImgs)}

    Terms to help you narrow your search:
    ${JSON.stringify(subscriptionKeywords)}


    Extract as much as possible. If you don't find a field, leave it empty.
    Example Output:
    {
        isSubscription: true,
    }
  `,
      system: "You are an AI that helps classify and identify emails.",
    });

    return object;
  },
});

export const emailToObject = internalAction({
  args: {
    email_html: v.string(),
    subject: v.string(),
    sender_email: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const $ = cheerio.load(args.email_html);

    const emailBody = getVisibleText($("body"), $);
    const emailLinks = getAllLinks($);
    const emailImgs = getAllImgs($);

    const { object } = await generateObject({
      temperature: 0.8,
      schema: z.object({
        service_name: z
          .string()
          .describe(
            "Domain extracted from from email or links in email (ex: netflix.com)"
          ),
        service_url: z
          .string()
          .describe("Link in email body or link behind company name/logo"),
        icon_url: z
          .string()
          .describe("any urls or favicons from email body")
          .optional(),
        billing_cycle: z
          .string()
          .describe(
            `Keywords like: "monthly", "yearly", "billed every", "next payment on"`
          )
          .optional(),
        plan: z
          .string()
          .describe(
            `Plan names like "Basic", "Pro", "Premium" in body or near price`
          )
          .optional(),
        amount: z
          .number()
          .describe("Currency patterns (e.g., 9.99, 10)")
          .optional(),
        currency: z
          .string()
          .describe(`Extract from symbol or match words like "USD", "EUR"`)
          .optional(),
        renewal_date: z
          .string()
          .describe(
            "Search for date formats: MM/DD/YYYY, April 21, 2025-05-01 (return in ISO format)"
          )
          .optional(),
        payment_method: z
          .string()
          .describe(`Phrases like "charged to Visa ending in 1234" or "PayPal"`)
          .optional(),
        tags: z
          .array(z.string())
          .describe(
            "Tags describing the nature of the email, limit to only 10."
          )
          .optional(),
      }),
      model,
      prompt: `
      I am building a simple subscription tracking tool by building a queriable timeline of the user's
      subcription purchase history. In the email look for keywords such as "billed monthly" which indicates it is a reoccuring payment. 
      Most likely to mean it is a subcription purchase.
  
      You are responsible for turning emails into an object. The goal is to extract consistent properties from an unstructured email into a structured javascript object that can 
      be stored and queried. You will be given an email that relates to a users' paid subscriptions, extract the following
      details from it. Do nothing if you do not understand it. Do exactly as you've been instructed.
  
      The following was parsed from the email HTML content using CheerioJs.
  
      Email Text: \`${emailBody}\`
      Links: ${JSON.stringify(emailLinks)}
      Images: ${JSON.stringify(emailImgs)}
      ${
        args.sender_email
          ? `
        Sender's email: ${args.sender_email}\n
        `
          : ""
      }
      ${
        args.subject
          ? `
        Email subject: ${args.subject}
        `
          : ""
      }
  
  
      Example 
      {
        service_name: "Grammarly",
        service_url: "https://www.grammarly.com",
        icon_url: "",
        billing_cycle: "yearly",
        plan: "", 
        amount: 9.99,
        currency: "USD",
        renewal_date: "2025-04-21T14:41:25.834Z",
        payment_method: "PayPal",
        tags: ["renewal", "subscription", "cancellation"],
      };
      `,
      system: `
      You are an AI that helps in converting emails to objects.
      `,
    });

    const result: SubscriptionEmailObject = {
      ...object,
      userId: args.userId,
      email_body: args.email_html,
      email_subject: args.subject,
      email_received_at: new Date().toISOString(),
    };

    return result;
  },
});

export const categorizeEmail = internalAction({
  args: {
    email_text: v.string(),
    user_categories: v.optional(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { object } = await generateObject({
      temperature: 0.8,
      schema: z.object({
        category: z
          .string()
          .describe(
            "The most appropriate category for the email, based on its content. Example categories: Marketing, Newsletter, Promotion, Notification."
          ),
      }),
      model,
      prompt: `
You are tasked with categorizing incoming emails.

- Only return the category name.
- Do not add commentary or explanation.
- The category should help users organize their inboxes more efficiently.
- Compare the email text with the provided user categories and select the most relevant match.
- If none closely match, choose the closest possible based on the content.

Email text:
${args.email_text}

User's preferred categories:
${JSON.stringify(args.user_categories)}

Proceed without the user preferred category, if it is an empty array.
      `,
      system:
        "You are an AI assistant specialized in categorizing user emails into simple tags for a dashboard.",
    });

    console.log("Categorized Email: ", object);

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
    const ev = await unipile.email.send({
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

    console.log("AI joke: ", ev);

    return ev;
  },
});

export const aiAutomation = action({
  args: {
    email_id: v.string(),
    account_id: v.string(),
    provider_id: v.string(),
    sender_email: v.string(),
    email_subject: v.string(),
    email_content: v.string(),
    recipient_email: v.string(),
    prompts: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { steps } = await generateText({
      model,
      temperature: 0.8,
      prompt: `
      You are an AI assistant that automates email actions based on the content and instructions from the user.
      
      Your available capabilities include:
      - Sending an email
      - Replying to an email
      - Deleting an email
      
      You must not add any remarks or comments outside of the requested actions.
      
      The following details are available for you to perform your tasks:
      - account_id: ${args.account_id}
      - provider_id: ${args.provider_id}
      - email_id: ${args.email_id}
      - email_subject: ${args.email_subject}
      - recipient_email: ${args.recipient_email}
      - sender_email: ${args.sender_email}
      
      The following are prompts from user:
      ${JSON.stringify(args.prompts)}

      Email content (plaintext): ${args.email_content}
      
      Depending on the email content and instructions given, you should:
      - Generate an appropriate email body in plain text if needed (no HTML).
      - Choose the correct action to perform.
      
      Example format:
      {
        "account_id": "GxwlUMaZTHefegva16XcWw",
        "provider_id": "{\"message_id\":\"<D8.08.07528.0034A846@unipile.com>\",\"uid\":\"AQMkADAwATM3ZmYAZS04YjYyLTkzMwA4LTAwAi0wMAoARgAAA6SPCWnzzEdJj0W3b32H3c8HAPXMsqSCUH9FpzZzxeMbKMQAAAIBDAAAAPXMsqSCUH9FpzZzxeMbKMQABHfkN3EAAAA=\"}",
        "email_id": "--R9___qXQKIu80oAF0lJA",
        "email_subject": "Payment for invoice.",
        "recipient_email": "example1@gmail.com",
        "sender_email": "emee@gmail.com",
        "body": "<You can generate this if needed>"
      }
          `,
      system: `
      You are an AI email automation assistant. Your job is to process the user's instructions and emails, and act accordingly by using the available tools. Do not leave any remarks or comments.
          `,
      tools: {
        sendAnEmail,
        deleteAnEmail,
        replyToAnEmail,
      },
    });
  },
});
