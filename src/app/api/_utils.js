import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function getDB() {
  const client = await clientPromise;
  return client.db("mydb"); // change db name if needed
}

export async function findUser(userId) {
  const db = await getDB();
  return db.collection("users").findOne({ _id: new ObjectId(userId)  });
}

export async function setTracking(userId, trackingDesired) {
  const db = await getDB();
  await db.collection("users").updateOne(
    { id: userId },
    { $set: { trackingDesired } }
  );
}

export async function upsertUser(user) {
  const {id, ...rest} = user;
  const db = await getDB();
  await db.collection("users").updateOne(
    { _id: new ObjectId(user.id)  },
    { $set: rest },
    { upsert: true }
  );
}

export async function pushLocationForUser(userId, loc) {
  const db = await getDB();
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId)  },
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
