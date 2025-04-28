import axios from "axios";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type GenerateHostedAuthenticationUrl = {
  object: "HostedAuthUrl";
  url: string;
};

// Generate a hosted authentication url for the client to
// connect their gmail
export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as { userId: string };

    if (!body || !body.userId) {
      return Response.json({ message: "userId is required" }, { status: 400 });
    }

    const userId = body.userId;

    const expiresIn24Hours = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    const payload = {
      type: "create",
      providers: ["GOOGLE"],
      api_url: process.env.UNIPILE_DSN,
      expiresOn: expiresIn24Hours,
      notify_url: `${process.env.UNIPILE_NOTIFY_URL}/api/unipile/notify_url`,
      // pass convex userId here
      name: userId,
      success_redirect_url: `${process.env.UNIPILE_SUCCESS_REDIRECT_URL || "http://localhost:3000"}/dashboard`,
    };

    const rq = await axios.post(
      `https://${process.env.UNIPILE_DSN}/api/v1/hosted/accounts/link`,
      payload,
      {
        headers: {
          "X-API-KEY": process.env.UNIPILE_API_TOKEN,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const res = rq.data as GenerateHostedAuthenticationUrl;

    return Response.json({
      url: res.url,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
};
