import { readDB, writeDB } from "../_utils";

async function sendPush(expoPushToken, action) {
  const body = {
    to: expoPushToken,
    // title: action === "start" ? "Start tracking" : "Stop tracking",
    // body: action === "start" ? "Tracking requested" : "Tracking stopped",
    // sound: null,
     priority: "high",
    data: { action: action === "start" ? "StartGettingLocation" : "StopGettingLocation" }
  };
  console.log("Sending push:", body);
  const req = await fetch("https://exp.host/--/api/v2/push/send?useFcmV1=true", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const res = await req.json();
  console.log("Push response:", res);
}

export async function POST(req, context) {
  const params = await context.params; // ✅ unwrap the promise
  const action = params.action;        // ✅ now safe

  if (!["start", "stop"].includes(action))
    return new Response("invalid action", { status: 400 });

  const { userId } = await req.json();
  if (!userId) return new Response("missing userId", { status: 400 });

  const db = await readDB();
  const i = db.users.findIndex(u => u.id === userId);
  if (i === -1) return new Response("user not found", { status: 404 });

  const user = db.users[i];
  db.users[i] = { ...user, trackingDesired: action === "start" };
  await writeDB(db);

  if (user.pushToken) await sendPush(user.pushToken, action);

  return Response.json({ ok: true });
}
