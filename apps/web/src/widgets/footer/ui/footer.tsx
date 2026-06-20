import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    heading: "Main",
    links: [
      { label: "Registration", href: "/register" },
      { label: "Bidding & buying help", href: "/help/buying" },
      { label: "Stores", href: "/stores" },
      { label: "Creator Collections", href: "/collections" },
      { label: "Seasonal Sales and events", href: "/events" },
    ],
  },
  {
    heading: "Sell",
    links: [
      { label: "Start selling", href: "/dashboard" },
      { label: "How to sell", href: "/help/selling" },
      { label: "Business sellers", href: "/sell/business" },
      { label: "Tools & apps", href: "/sell/tools" },
      { label: "Developers", href: "/developers" },
      { label: "Security center", href: "/security" },
    ],
  },
  {
    heading: "Help & Contacts",
    links: [
      { label: "Seller center", href: "/help/seller" },
      { label: "Contact Us", href: "/help/contact" },
      { label: "Quby money back Guarantee", href: "/help/guarantee" },
    ],
  },
  {
    heading: "About Quby",
    links: [
      { label: "Privacy Policy", href: "/about/privacy" },
      { label: "Terms of use", href: "/about/terms" },
      { label: "Career", href: "/about/careers" },
      { label: "Investors", href: "/about/investors" },
      { label: "Company info", href: "/about" },
      { label: "Advertisement", href: "/about/advertise" },
      { label: "Product safety tips", href: "/about/safety" },
    ],
  },
  {
    heading: "Social Media",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Twitter", href: "https://twitter.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#5A8A02] text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="flex gap-12 lg:gap-16">
          {/* Logo */}
          <div className="flex shrink-0 flex-col items-start">
            <Image
              src="/images/logo.png"
              alt="Quby logo"
              width={112}
              height={112}
              className="rounded-2xl"
            />
            <span className="mt-4 text-xl font-bold tracking-tight">Quby</span>
            <span className="mt-1 text-sm text-white/50">Your marketplace</span>
          </div>

          {/* Nav columns */}
          <nav
            aria-label="Footer navigation"
            className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5"
          >
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/75 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 flex items-center justify-between">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Quby. All rights reserved.
          </p>
          <p className="text-xs text-white/35">Made with care</p>
        </div>
      </div>
    </footer>
  );
}
