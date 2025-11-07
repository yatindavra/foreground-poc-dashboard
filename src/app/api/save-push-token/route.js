import { readDB, writeDB, upsertUser } from "../_utils";

export async function POST(req) {
  const { userId, name, pushToken } = await req.json();
  if (!userId || !pushToken) return new Response("missing userId/pushToken", { status: 400 });
  const db = await readDB();
  upsertUser(db, { id: userId, name: name || userId, pushToken, trackingDesired: false, locations: db.users.find(u => u.id === userId)?.locations || [] });
  await writeDB(db);
  return Response.json({ ok: true });
}
