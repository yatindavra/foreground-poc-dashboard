import { findUser, setTracking } from "../_utils";

async function sendPush(expoPushToken, action) {
  const body = {
    to: expoPushToken,
    priority: "high",
    data: { action: action === "start" ? "StartGettingLocation" : "StopGettingLocation" }
  };

  const req = await fetch("https://exp.host/--/api/v2/push/send?useFcmV1=true", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  await req.json();
}

export async function POST(req, context) {
  const params = await context.params;
  const action = params.action;

  if (!["start", "stop"].includes(action))
    return new Response("invalid action", { status: 400 });

  const { userId } = await req.json();
  if (!userId) return new Response("missing userId", { status: 400 });

  const user = await findUser(userId);
  if (!user) return new Response("user not found", { status: 404 });

  await setTracking(userId, action === "start");

  if (user.pushToken) await sendPush(user.pushToken, action);

  return Response.json({ ok: true });
}
