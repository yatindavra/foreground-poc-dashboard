import { readDB, writeDB, pushLocationForUser } from "../_utils";

export async function POST(req) {
  const { userId, latitude, longitude, timestamp } = await req.json();
  if (!userId || typeof latitude !== "number" || typeof longitude !== "number") return new Response("invalid payload", { status: 400 });
  const db = await readDB();
  pushLocationForUser(db, userId, { latitude, longitude, timestamp: timestamp || new Date().toISOString() });
  await writeDB(db);
  return Response.json({ ok: true });
}
