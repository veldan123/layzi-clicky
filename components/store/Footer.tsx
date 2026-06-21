import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[--color-border] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-black text-[--color-primary] mb-3">
              Layzi Clicky
            </h3>
            <p className="text-sm text-[--color-muted-foreground] leading-relaxed">
              Handcrafted 3D printed fidget clickers made with love. Satisfying
              clicks, adorable designs.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[--color-foreground] mb-3 text-sm uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-[--color-muted-foreground] hover:text-[--color-primary] transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[--color-muted-foreground] hover:text-[--color-primary] transition-colors"
                >
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[--color-foreground] mb-3 text-sm uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@lazyclicky.com"
                  className="text-sm text-[--color-muted-foreground] hover:text-[--color-primary] transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[--color-border] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[--color-muted]">
            © {new Date().getFullYear()} Layzi Clicky. All rights reserved.
          </p>
          <p className="text-xs text-[--color-muted]">
            Made with 💕 and a 3D printer
          </p>
        </div>
      </div>
    </footer>
  );
}
