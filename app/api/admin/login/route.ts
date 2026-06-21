import { NextRequest } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const result = await signIn(email, password);

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 401 });
  }

  return Response.json({ ok: true });
}
