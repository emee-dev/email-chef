import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import unipile from "@/lib/unipile";
import { fetchMutation } from "convex/nextjs";

export const dynamic = "force-dynamic";

type UnipileAuthenticationNotification = {
  status: "CREATION_SUCCESS";
  account_id: string;
  name: string;
};

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as UnipileAuthenticationNotification;

    if (!body || Object.keys(body).length === 0) {
      return Response.json(
        { message: "Invalid request please try again" },
        { status: 400 }
      );
    }

    if (body.status !== "CREATION_SUCCESS") {
      return Response.json(
        { message: "Error linking email please retry" },
        { status: 404 }
      );
    }

    const userId = body.name;
    const unipileAccountId = body.account_id;

    const data = await unipile.account.getOne(unipileAccountId);

    if (data.type !== "GOOGLE_OAUTH" || data.object !== "Account") {
      return Response.json({ message: "Invalid message" }, { status: 400 });
    }

    // Not validated so it could be anything
    const userEmail = data.connection_params.mail.id;

    await fetchMutation(api.integrations.create, {
      userId: userId as Id<"users">,
      accountId: unipileAccountId,
      email: userEmail,
    });

    return Response.json(
      { msg: "User account is linked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json({ msg: "server error" }, { status: 500 });
  }
};
