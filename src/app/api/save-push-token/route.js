import { cookies, headers } from "next/headers";
import { upsertUser } from "../_utils";

export async function POST(req) {
  const {  pushToken } = await req.json();
 
  const userId = req.headers.get("x-user-id"); 
  console.log("Payload API userId:", userId);


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
