-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- Seed default categories
INSERT INTO "categories" ("id", "slug", "name", "sort_order") VALUES
    ('c0000001-0000-4000-8000-000000000001', 'women', 'women', 1),
    ('c0000002-0000-4000-8000-000000000002', 'men', 'men', 2),
    ('c0000003-0000-4000-8000-000000000003', 'kids', 'kids', 3),
    ('c0000004-0000-4000-8000-000000000004', 'designer-items', 'designer items', 4),
    ('c0000005-0000-4000-8000-000000000005', 'home', 'home', 5),
    ('c0000006-0000-4000-8000-000000000006', 'electronics', 'electronics', 6),
    ('c0000007-0000-4000-8000-000000000007', 'sports', 'sports', 7),
    ('c0000008-0000-4000-8000-000000000008', 'entertainment', 'entertainment', 8),
    ('c0000009-0000-4000-8000-000000000009', 'hobby-collector-items', 'hobby & collector items', 9);
