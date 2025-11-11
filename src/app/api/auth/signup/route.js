import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret123";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("mydb");

  const exist = await db.collection("users").findOne({ email });
  if (exist) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.collection("users").insertOne({
    email,
    password: hashed,
    createdAt: new Date()
  });

  const token = jwt.sign({ id: result.insertedId, email }, SECRET, {
    expiresIn: "7d",
  });

  return NextResponse.json({ token });
}
