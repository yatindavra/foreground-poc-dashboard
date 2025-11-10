import { cookies, headers } from "next/headers";
import { upsertUser } from "../_utils";

export async function POST(req) {
  const { userId, pushToken } = await req.json();

  const cookieStore = cookies();
  const authToken = cookieStore.get("authToken")?.value;

  const authorization = headers().get("authorization");

  if (!userId || !pushToken) {
    return new Response("missing userId/pushToken", { status: 400 });
  }

  await upsertUser({ id: userId, pushToken, trackingDesired: false });

  return Response.json({
    ok: true,
    authToken,
    authorization
  });
}
