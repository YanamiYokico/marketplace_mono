export type ProductTagGroup = {
  key: string;
  title: string;
  options: string[];
};

/**
 * Seller-selectable product attribute tags. Shared by the seller product form
 * and the catalog filter sidebar so their values never drift.
 * Add a group here → it appears in both places.
 */
export const PRODUCT_TAG_GROUPS: ProductTagGroup[] = [
  { key: "condition", title: "Condition", options: ["New", "Refurbished", "Used"] },
  { key: "gender", title: "Gender", options: ["Men", "Women", "Unisex", "Kids"] },
  {
    key: "season",
    title: "Season",
    options: ["Spring", "Summer", "Autumn", "Winter", "All Season"],
  },
  {
    key: "promotions",
    title: "Promotions",
    options: [
      "On Sale",
      "Clearance",
      "Special Offer",
      "Best Seller",
      "New Arrival",
    ],
  },
];

export const ALL_PRODUCT_TAGS = PRODUCT_TAG_GROUPS.flatMap((g) => g.options);
