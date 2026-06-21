import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Seed the Dumpling Clicker product
  const existing = await db.product.findUnique({
    where: { slug: "cute-3d-printed-dumpling-clicker" },
  });

  if (!existing) {
    const product = await db.product.create({
      data: {
        name: "Cute 3D Printed Dumpling Clicker",
        slug: "cute-3d-printed-dumpling-clicker",
        description:
          "Meet the Dumpling Clicker — your new favourite fidget companion! Shaped like an adorable little dumpling, this 3D printed clicker delivers the most satisfying click you've ever felt. Pocket-sized, endlessly clickable, and impossibly cute. Each one is printed and assembled by hand, so yours will be uniquely yours. Available in multiple colors!",
        price: 12.99,
        images: ["/placeholder.svg"],
        active: true,
        variants: {
          create: [
            {
              name: "Color",
              value: "Classic White",
              images: ["/placeholder.svg"],
              stock: 99,
            },
            {
              name: "Color",
              value: "Sakura Pink",
              images: ["/placeholder.svg"],
              stock: 99,
            },
            {
              name: "Color",
              value: "Mint Green",
              images: ["/placeholder.svg"],
              stock: 99,
            },
          ],
        },
      },
    });
    console.log(`✅ Created product: ${product.name}`);
  } else {
    console.log(`ℹ️  Product already exists: ${existing.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
