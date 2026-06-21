import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ product });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, price, images, active, variants } = body;

  const product = await db.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(images !== undefined && { images }),
      ...(active !== undefined && { active }),
    },
    include: { variants: true },
  });

  // Replace variants if provided
  if (variants !== undefined) {
    await db.variant.deleteMany({ where: { productId: id } });
    if (variants.length > 0) {
      await db.variant.createMany({
        data: variants.map((v: { name: string; value: string; images?: string[]; stock?: number }) => ({
          productId: id,
          name: v.name,
          value: v.value,
          images: v.images ?? [],
          stock: v.stock ?? 99,
        })),
      });
    }
  }

  const updated = await db.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  return Response.json({ product: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Soft delete — set active: false instead of destroying
  await db.product.update({ where: { id }, data: { active: false } });
  return Response.json({ ok: true });
}
