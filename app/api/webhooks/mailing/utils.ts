import * as cheerio from "cheerio";
import { getAllImgs, getAllLinks, getVisibleText } from "@/lib/utils";
import { generateObject, LanguageModelV1 } from "ai";
import { z } from "zod";

type EmailToObject = {
  email_html: string;
  userId: string;
  subject: string;
  model: LanguageModelV1;
};

type isSubscriptionEmail = {
  email_html: string;
  model: LanguageModelV1;
};

type SubscriptionEmailObject = {
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

export const emailToObject = async ({
  model,
  userId,
  subject,
  email_html,
}: EmailToObject): Promise<SubscriptionEmailObject> => {
  const $ = cheerio.load(email_html);

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
        .describe("Tags describing the nature of the email, limit to only 10.")
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
    userId,
    email_body: email_html,
    email_subject: subject,
    email_received_at: new Date().toISOString(),
  };

  return result;
};

export const isSubscriptionEmail = async ({
  model,
  email_html,
}: isSubscriptionEmail) => {
  const $ = cheerio.load(email_html);
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

  // 2. Proceed to extract structured data using AI
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
    system: `
You are an AI that helps classify and identify emails.
    `,
  });

  return object;
};
