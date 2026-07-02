import { PRODUCT_TAG_GROUPS } from "@/entities/product";

export type FilterSectionConfig = {
  key: string;
  title: string;
  options: string[];
  defaultExpanded?: boolean;
};

/** Selected values keyed by section. Add a section = add an entry to FILTER_SECTIONS. */
export type FilterState = Record<string, string[]>;

export const FILTER_SECTIONS: FilterSectionConfig[] = [
  {
    key: "price",
    title: "Price",
    options: ["Up to 5", "10–100", "More than 100"],
    defaultExpanded: true,
  },
  {
    key: "availability",
    title: "Availability",
    options: ["In Stock", "Out of Stock", "Pre-Order", "Back Order"],
  },
  {
    key: "shipping",
    title: "Shipping Method",
    options: [
      "Standard Shipping",
      "Express Shipping",
      "Courier Delivery",
      "Store Pickup",
    ],
  },
  // Condition, Gender, Season, Promotions — shared with the seller product form
  // so the tag values used for filtering always match what sellers can set.
  ...PRODUCT_TAG_GROUPS,
];
