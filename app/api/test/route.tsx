import { NextResponse } from "next/server";

// api/hello.js
export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}
  