import { pushLocationForUser } from "../_utils";

export async function POST(req) {
  const { userId, latitude, longitude, timestamp } = await req.json();
  if (!userId || typeof latitude !== "number" || typeof longitude !== "number") return new Response("invalid payload", { status: 400 });
  await pushLocationForUser(userId, { latitude, longitude, timestamp: timestamp || new Date().toISOString() });
  return Response.json({ ok: true });
}
