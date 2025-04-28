import unipile from "@/lib/unipile";
import { NextRequest } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  try {
    const body = (await req.json()) as { userId: string };

    if (!body.userId) {
      return Response.json({ message: "Invalid userId" }, { status: 404 });
    }

    const record = await fetchQuery(api.integrations.getUserAccountId, {
      userId: body.userId,
    });

    if (!record) {
      return Response.json(
        {
          message: "No user record found, try again later.",
        },
        { status: 400 }
      );
    }

    if (!record.accountId) {
      return Response.json(
        {
          message: "User has not connected gmail, try again later.",
        },
        { status: 404 }
      );
    }

    const folder = await unipile.email.getAllFolders({
      account_id: record.accountId,
    });

    return Response.json(folder);
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};
