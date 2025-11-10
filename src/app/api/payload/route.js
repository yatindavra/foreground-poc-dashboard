import { NextResponse } from "next/server";
import { pushLocationForUser } from "../_utils";

export async function POST(req) {
  const userId = req.headers.get("x-user-id");// ← from middleware
  console.log("Payload API userId:", userId);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { latitude, longitude, timestamp } = await req.json();

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await pushLocationForUser(userId, {
    latitude,
    longitude,
    timestamp: timestamp || new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
