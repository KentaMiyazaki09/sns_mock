-- Migrate legacy posts that stored GitHub providerAccountId before Auth.js used the Prisma adapter.
UPDATE "Post" AS p
SET "userId" = a."user_id"
FROM "accounts" AS a
WHERE p."userId" = a."provider_account_id";

-- Create minimal user records for any remaining orphaned posts so the foreign key can be added safely.
INSERT INTO "users" ("id", "name")
SELECT DISTINCT p."userId", p."userName"
FROM "Post" AS p
LEFT JOIN "users" AS u ON u."id" = p."userId"
WHERE u."id" IS NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
