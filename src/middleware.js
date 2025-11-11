export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret123";

export default async function middleware(req) {
  const authHeader = req.headers.get("authorization");
  console.log("Middleware authHeader:", authHeader);

  if (!authHeader?.startsWith("Bearer "))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, SECRET);
  } catch (e) {
    console.error("JWT verification failed:", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // ✅ Create new headers and attach userId
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", decoded.id);

  // ✅ Pass request along with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/payload/:path*','/api/save-push-token/:path*' ],
};
