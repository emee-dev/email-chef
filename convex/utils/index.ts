import * as cheerio from "cheerio";

export function getAllLinks(
  $: cheerio.CheerioAPI
): { href: string; text: string }[] {
  const links: { href: string; text: string }[] = [];

  const element = $("a[href]");

  element.each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      links.push({
        href,
        text: $(el).text().trim(),
      });
    }
  });

  return links;
}

export function getAllImgs(
  $: cheerio.CheerioAPI
): { src: string; alt: string }[] {
  const links: { src: string; alt: string }[] = [];

  const element = $("img[src]");

  element.each((_, el) => {
    const src = $(el).attr("src");
    const alt = $(el).attr("alt");
    if (src) {
      links.push({
        src,
        alt: alt?.trim() || "",
      });
    }
  });

  return links;
}

export function getVisibleText(element: any, $: cheerio.CheerioAPI): string {
  return element
    .contents()
    .toArray()
    .map((el: any) => {
      if (el.type === "text") {
        return (`${el.data}` || "").trim();
      } else if (el.type === "tag") {
        return getVisibleText($(el), $);
      }
      return ""; // Ignore comments, directives, etc.
    })
    .filter(Boolean)
    .join("\n");
}

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
