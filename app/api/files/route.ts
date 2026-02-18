import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const uploadPath = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadPath)) {
    return NextResponse.json([]);
  }

  const files = fs.readdirSync(uploadPath);

  return NextResponse.json(files);
}
