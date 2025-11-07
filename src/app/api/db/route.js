import { readDB } from "../_utils";

export async function GET() {
  const db = await readDB();
  return Response.json(db, { headers: { "Cache-Control": "no-store" } });
}
