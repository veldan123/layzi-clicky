import Link from "next/link";
import { Share2, Mail } from "lucide-react";

const links = {
  Shop: [
    { href: "/collections", label: "Collections" },
    { href: "/shop", label: "All Products" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
  Support: [
    { href: "/faq#shipping", label: "Shipping Info" },
    { href: "/faq#returns", label: "Returns" },
    { href: "mailto:hello@layziclicky.com", label: "Contact Us" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <p
              className="font-bold text-lg tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              LAYZI CLICKY
            </p>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Handcrafted 3D printed fidget clickers made in Singapore.
              Designed to be the most satisfying thing in your pocket.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="mailto:hello@layziclicky.com"
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-white/50 hover:text-[--color-primary] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-white/50 hover:text-[--color-primary] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-5">{group}</p>
              <ul className="space-y-3">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Layzi Clicky. All rights reserved.
          </p>
          <p className="text-xs text-white/30">Handmade in Singapore</p>
        </div>
      </div>
    </footer>
  );
}
