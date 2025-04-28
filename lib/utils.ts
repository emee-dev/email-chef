import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as cheerio from "cheerio";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColorForDomain = (domain: string) => {
  // Generate consistent colors based on domain name
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
    "bg-green-100 text-green-800",
    "bg-amber-100 text-amber-800",
    "bg-rose-100 text-rose-800",
    "bg-indigo-100 text-indigo-800",
    "bg-cyan-100 text-cyan-800",
    "bg-emerald-100 text-emerald-800",
  ];

  // Simple hash function to get consistent color for same domain
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

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
    .map((el) => {
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
