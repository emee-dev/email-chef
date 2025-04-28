type SubscriptionEmailData = {
  _id: string;
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
  _creationTime?: number;
};

export const subs: SubscriptionEmailData[] = [
  {
    _id: "1",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Vetter",
    service_url: "https://www.getvetter.com",
    email_subject: "Your Vetter Subscription Renewal",
    email_body: `Hi [Customer Name],\n  \n  Your Vetter subscription is set to renew for 2022. We're excited to continue supporting your team's idea management process. If you have any questions or need to make changes to your subscription, feel free to 
 \n reach out.\n  \n  Best,\n  The Vetter Team`,
    email_received_at: "2025-04-21T14:41:25.833Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "2",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Grammarly",
    service_url: "https://www.grammarly.com",
    billing_cycle: "yearly",
    email_subject: "Your Grammarly Premium Subscription Renewal",
    email_body: `Hello [Customer Name],\n  \n  Just a friendly reminder: your Grammarly Premium subscription will renew in 60 days. Ensure your billing information is up to date to continue enjoying advanced writing assistance features.\n  \n  Thank you 
 \n for choosing Grammarly!\n  \n  Best regards,\n  The Grammarly Team`,
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "3",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Fathom Analytics",
    service_url: "https://usefathom.com",
    billing_cycle: "monthly",
    email_subject: "Upcoming Fathom Analytics Subscription Renewal",
    email_body:
      "Hey [Customer Name],\n  \n  We believe in transparency. That's why we're letting you know that your Fathom Analytics subscription will renew in 3 days. If you wish to make any changes, please visit your account settings.\n  \n  Cheers,\n  The Fathom Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "4",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Notion",
    service_url: "https://www.notion.so",
    billing_cycle: "monthly",
    email_subject: "Notion Subscription Renewal Reminder",
    email_body: `Hi [Customer Name],\n  \n  This is a reminder that your Notion subscription will be charged in 7 days. To manage your subscription or update payment details, please visit your account page.\n  \n  Thank you for using Notion!\n  \n  Warm 
 \n wishes,\n  The Notion Team`,
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "5",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Help Scout",
    service_url: "https://www.helpscout.com",
    billing_cycle: "yearly",
    payment_method: "Card ending in 1234",
    email_subject: "Help Scout Annual Renewal Notice",
    email_body:
      "Dear [Customer Name],\n  \n  Time flies when you're having fun, right? Your annual Help Scout subscription is up for renewal. The last four digits of the card on file are 1234. If you need assistance or have questions, we're here to help.\n  \n  Best,\n  The Help Scout Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "6",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "SparkToro",
    service_url: "https://sparktoro.com",
    email_subject: "SparkToro Billing Reminder",
    email_body:
      "Hi [Customer Name],\n  \n  Your SparkToro billing is coming up. We never charge without prior notice. If you need to update your subscription details or have any questions, please let us know.\n  \n  Thank you for being a valued customer!\n  \n  Sincerely,\n  The SparkToro Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "7",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Camo",
    service_url: "https://reincubate.com/camo",
    email_subject: "Camo Subscription Renewal",
    email_body:
      "Hello [Customer Name],\n  \n  Thank you for being a valued Camo subscriber. Your subscription is set to renew on [Renewal Date]. To manage your subscription or update payment details, please visit your account settings.\n  \n  Best regards,\n  The Camo Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "8",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Baremetrics",
    service_url: "https://baremetrics.com",
    email_subject: "Baremetrics Subscription Renewal",
    email_body: `Hi [Customer Name],\n  \n  Your Baremetrics subscription is about to renew. If you have any questions or need to make changes, please reach out. We're here to assist you.\n  \n  Thank you for choosing Baremetrics!\n  \n  Warm regards,\n 
 \n  The Baremetrics Team`,
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "9",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Livestorm",
    service_url: "https://livestorm.co",
    renewal_date: "2023-01-23",
    email_subject: "Livestorm Subscription Renewal on 23-Jan-2023",
    email_body: `Dear [Customer Name],\n  \n  Your subscription with Livestorm will renew itself on 23-Jan-2023. If you wish 
 \n to cancel or have any questions, please contact your account manager.\n  \n  Thank you for using Livestorm!\n  \n  Best,\n  The Livestorm Team`,
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "10",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Readable",
    service_url: "https://readable.com",
    email_subject: "Readable Subscription Renewal Notice",
    email_body:
      "Hi [Customer Name],\n  \n  Just a heads-up: your Readable subscription will renew soon. To update your billing details or manage your subscription, please visit your account page.\n  \n  Thank you for choosing Readable!\n  \n  Sincerely,\n  The Readable Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "11",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Zoom",
    service_url: "https://zoom.us",
    email_subject: "Zoom Subscription Renewal Reminder",
    email_body: `Hello [Customer Name],\n  \n  Thank you for being a loyal Zoom customer. Your subscription is due for renewal. Please ensure your billing information is current. To update or manage your subscription, visit your account settings.\n  \n  
 \n Best regards,\n  The Zoom Team`,
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "12",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Figma",
    service_url: "https://figma.com",
    renewal_date: "2022-07-20",
    email_subject: "Figma Subscription Renewal",
    email_body:
      "Dear [Customer Name],\n  \n  This is a reminder that your Figma subscription will renew on July 20, 2022. The amount to be charged is $XX.XX. To manage your subscription, please visit your Admin dashboard.\n  \n  Thank you for using Figma!\n  \n  Warm wishes,\n  The Figma Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "13",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Vimeo",
    service_url: "https://vimeo.com",
    renewal_date: "2022-08-05",
    email_subject: "Vimeo Subscription Scheduled for Renewal",
    email_body:
      "Hi [Customer Name],\n  \n  Your Vimeo subscription is scheduled for renewal on 08/05/2022. To continue enjoying our Pro features, ensure your payment information is up to date. For any changes, visit your account settings.\n  \n  Best,\n  The Vimeo Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "14",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Slack",
    service_url: "https://slack.com",
    email_subject: "Slack Subscription Payment Update",
    email_body:
      "Hello [Customer Name],\n  \n  Is your payment information up to date? Your Slack subscription renewal is approaching. Please verify your billing details to avoid any service interruptions.\n  \n  Thank you for using Slack!\n  \n  Sincerely,\n  The Slack Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "15",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Front",
    service_url: "https://front.com",
    email_subject: "Front Subscription Renewal",
    email_body:
      "Hi [Customer Name],\n  \n  Your subscription to Front will renew soon. The renewal is scheduled for [Date] at [Time]. To update your payment details or manage your subscription, please visit your account page.\n  \n  Best regards,\n  The Front Team",
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
  {
    _id: "16",
    userId: "k178w08gng28c29q8c33meavrs7e01ms",
    service_name: "Testi.ai",
    service_url: "https://testi.ai",
    email_subject: "Your Testi.ai Plan Expires Soon",
    email_body: `Dear [Customer Name],\n  \n  Your plan expires soon — renew today to continue enjoying our services without 
 \n interruption. To renew or manage your subscription, please visit your account settings.\n  \n  Thank you for choosing Testi.ai!\n  \n  Warm regards,\n  The Testi.ai Team`,
    email_received_at: "2025-04-21T14:41:25.834Z",
    tags: ["renewal", "subscription"],
    _creationTime: 0,
  },
];
