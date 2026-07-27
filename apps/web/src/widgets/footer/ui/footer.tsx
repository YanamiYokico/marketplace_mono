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
    heading: "Help & contacts",
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
    heading: "Social media",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Twitter", href: "https://twitter.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#5A8A02] font-[family-name:var(--font-poppins)] text-white">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-[170px_1fr] sm:gap-14 lg:px-0">
        <div className="flex flex-col items-start justify-between">
          <Image
            src="/images/icons/header_quby_mark.svg"
            alt="Quby"
            width={170}
            height={202}
            className="h-auto w-[170px]"
          />
          <p className="mt-8 text-sm">Copyright</p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-12"
        >
          {columns.map((column) => (
            <div key={column.heading}>
              <p className="mb-3 text-[16px] font-normal leading-5">
                {column.heading}
              </p>
              <ul className="flex flex-col gap-2 text-[14px] leading-[18px]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-opacity hover:opacity-70"
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
    </footer>
  );
}
