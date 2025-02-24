import { NextResponse } from "next/server";

// NOTE: This file is not used, but it's here to satisfy the Next.js routing system.
export async function GET() {
  return NextResponse.json({ message: "Auth endpoint" });
} 