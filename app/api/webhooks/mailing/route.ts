import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface UnipileIncomingEmail {
  email_id: string;
  account_id: string;
  event: "mail_received";
  webhook_name: string;
  date: string;
  from_attendee: {
    display_name: string;
    identifier: string; // email address
    identifier_type: "EMAIL_ADDRESS";
  };
  to_attendees: [
    {
      display_name: string;
      identifier: string; // email address
      identifier_type: "EMAIL_ADDRESS";
    },
  ];
  bcc_attendees: [];
  cc_attendees: [];
  reply_to_attendees: [];
  provider_id: string;
  message_id: string;
  has_attachments: boolean;
  subject: string;
  body: string;
  body_plain: "";
  attachments: [];
  folders: string[]; // where it is located
  role: string;
  read_date: null;
  is_complete: false;
  in_reply_to: {
    message_id: string;
    id: string;
  };
  tracking_id: string;
  origin: "unipile" | "external"; // "external"
}

/**
 * Allows us to recieve incoming emails via Unipile webhook notification.
 */
// export const POST = async (req: NextRequest) => {
//   try {
//     const emailPayload = (await req.json()) as UnipileIncomingEmail;

//     const unipileAccountId = emailPayload.account_id;

//     const user = await fetchQuery(api.integrations.getUserId, {
//       accountId: unipileAccountId,
//     });

//     if (!user) {
//       return Response.json(
//         { message: "Unable to process this email" },
//         { status: 400 }
//       );
//     }

//     // 2. Handle Subcription related emails
//     const { isSubscription } = await isSubscriptionEmail({
//       email_html: emailPayload.body,
//       model,
//     });

//     if (isSubscription) {
//       const subscription = await emailToObject({
//         model,
//         email_html: emailPayload.body,
//         subject: emailPayload.subject,
//         userId: user.userId,
//       });

//       // store subscription
//       await fetchMutation(api.subscriptions.create, subscription);

//       // Analytics
//       const serviceUrl = subscription.service_url;

//       const storeDomain = await fetchMutation(
//         api.webhook.storeDomainAnalytics,
//         {
//           service_url: serviceUrl,
//           userId: user.userId,
//         }
//       );
//     }

//     // 3. Execute user defined rules on the email
//     const storedRules = await fetchQuery(api.webhook.listRules, {
//       userId: user.userId,
//     });

//     return Response.json({ message: "Ok" });
//   } catch (error) {
//     console.log(error);
//     return Response.json({ message: "Internal server error" }, { status: 500 });
//   }
// };

export const POST = async (req: NextRequest) => {
  try {
    const email = (await req.json()) as UnipileIncomingEmail;

    if (!email) {
      return Response.json(
        { message: "Unable to process this email" },
        { status: 404 }
      );
    }

    const workflow = await fetchMutation(api.workflow.kickoffWebhookWorkflow, {
      subject: email.subject,
      email_html: email.body,
      email_id: email.email_id,
      account_id: email.account_id,
      provider_id: email.provider_id,
      emailIdentifier: email.email_id,
      email_plain_text: email.body_plain,
      sender_email: email.from_attendee.identifier,
      sender_name: email.from_attendee.display_name,
    });

    return Response.json(
      {
        message: "Processing email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};
