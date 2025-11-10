import { getDB } from "../_utils";

export async function GET() {
  const db = await getDB();
  const users = await db.collection("users").find({}).toArray();
  return Response.json({ users }, { headers: { "Cache-Control": "no-store" } });
}
