import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const collection = await db.collection.findUnique({
    where: { id },
    include: { products: { include: { product: { include: { variants: true } } }, orderBy: { sortOrder: "asc" } } },
  });

  if (!collection) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ collection });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, heroImage, active, sortOrder, productIds } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) {
    data.name = name.trim();
    const newSlug = slugify(name);
    const conflict = await db.collection.findFirst({ where: { slug: newSlug, NOT: { id } } });
    data.slug = conflict ? `${newSlug}-${Date.now()}` : newSlug;
  }
  if (description !== undefined) data.description = description?.trim() || null;
  if (heroImage !== undefined) data.heroImage = heroImage;
  if (active !== undefined) data.active = active;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;

  if (productIds !== undefined) {
    await db.collectionProduct.deleteMany({ where: { collectionId: id } });
    if (productIds.length > 0) {
      await db.collectionProduct.createMany({
        data: productIds.map((pid: string, i: number) => ({ collectionId: id, productId: pid, sortOrder: i })),
      });
    }
  }

  const collection = await db.collection.update({
    where: { id },
    data,
    include: { products: { include: { product: { include: { variants: true } } }, orderBy: { sortOrder: "asc" } } },
  });

  return Response.json({ collection });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.collection.delete({ where: { id } });
  return Response.json({ ok: true });
}
