import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await users.insertOne({
    email,
    password: hashed,
    name: name || "",
    createdAt: new Date(),
  });

  return NextResponse.json({ message: "User created", userId: result.insertedId });
}
