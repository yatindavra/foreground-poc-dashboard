import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "tmp", "db.json");

export async function readDB() {
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return { users: [] };
  }
}

export async function writeDB(db) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

export function upsertUser(db, user) {
  const i = db.users.findIndex(u => u.id === user.id);
  if (i === -1) db.users.push(user);
  else db.users[i] = { ...db.users[i], ...user };
  return db;
}

export function pushLocationForUser(db, userId, loc) {
  const i = db.users.findIndex(u => u.id === userId);
  if (i === -1) return db;
  const u = db.users[i];
  const arr = Array.isArray(u.locations) ? u.locations : [];
  const next = [...arr, loc].slice(-10);
  db.users[i] = { ...u, locations: next,trackingDesired: "start", currentLocation: { latitude: loc.latitude, longitude: loc.longitude }, lastSeen: loc.timestamp };
  return db;
}
