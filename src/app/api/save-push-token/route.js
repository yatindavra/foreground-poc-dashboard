import { upsertUser } from "../_utils";

export async function POST(req) {
  const { userId, name, pushToken } = await req.json();
  if (!userId || !pushToken) return new Response("missing userId/pushToken", { status: 400 });
  await upsertUser({ id: userId, name: name || userId, pushToken, trackingDesired: false });
  return Response.json({ ok: true });
}
