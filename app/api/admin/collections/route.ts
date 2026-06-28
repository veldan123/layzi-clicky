import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const collections = await db.collection.findMany({
    include: { products: { include: { product: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return Response.json({ collections });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, heroImage, active, sortOrder, productIds } = body;

  if (!name?.trim()) return Response.json({ error: "Name is required" }, { status: 400 });

  let slug = slugify(name);
  const existing = await db.collection.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const collection = await db.collection.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      heroImage: heroImage || "/placeholder.svg",
      active: active ?? true,
      sortOrder: sortOrder ?? 0,
      products: productIds?.length
        ? { create: productIds.map((id: string, i: number) => ({ productId: id, sortOrder: i })) }
        : undefined,
    },
    include: { products: { include: { product: true } } },
  });

  return Response.json({ collection }, { status: 201 });
}
