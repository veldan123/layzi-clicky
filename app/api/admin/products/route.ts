import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session.valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, images, variants, active } = body;

  if (!name || !description || price == null) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  let slug = slugify(name);

  // Ensure unique slug
  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = await db.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      images: images ?? [],
      active: active ?? true,
      variants: variants?.length
        ? {
            create: variants.map((v: { name: string; value: string; images?: string[]; stock?: number }) => ({
              name: v.name,
              value: v.value,
              images: v.images ?? [],
              stock: v.stock ?? 99,
            })),
          }
        : undefined,
    },
    include: { variants: true },
  });

  return Response.json({ product }, { status: 201 });
}
