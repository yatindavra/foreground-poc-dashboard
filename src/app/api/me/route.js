import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const SECRET = process.env.JWT_SECRET || "secret123";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded token:", decoded);
    const client = await clientPromise;
    const db = client.db("mydb");
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id)  });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.log("{ id: user._id, email: user.email }",{ id: user._id, email: user.email })
    return NextResponse.json({ id: user._id, email: user.email });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
