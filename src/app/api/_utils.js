import clientPromise from "@/lib/db";

export async function getDB() {
  const client = await clientPromise;
  return client.db("mydb"); // change db name if needed
}

export async function findUser(userId) {
  const db = await getDB();
  return db.collection("users").findOne({ id: userId });
}

export async function setTracking(userId, trackingDesired) {
  const db = await getDB();
  await db.collection("users").updateOne(
    { id: userId },
    { $set: { trackingDesired } }
  );
}

export async function upsertUser(user) {
  const db = await getDB();
  await db.collection("users").updateOne(
    { id: user.id },
    { $set: user },
    { upsert: true }
  );
}

export async function pushLocationForUser(userId, loc) {
  const db = await getDB();
  await db.collection("users").updateOne(
    { id: userId },
    {
      $push: { locations: { $each: [loc], $slice: -10 } },
      $set: {
        currentLocation: { latitude: loc.latitude, longitude: loc.longitude },
        lastSeen: loc.timestamp,
        trackingDesired: "start"
      }
    }
  );
}
