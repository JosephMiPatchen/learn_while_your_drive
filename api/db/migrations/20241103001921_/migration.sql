/*
  Warnings:

  - You are about to drop the `Goal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `goalId` on the `ContentItem` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ContentItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Goal";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "nextContentItemId" TEXT,
    CONSTRAINT "ContentItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentItem_nextContentItemId_fkey" FOREIGN KEY ("nextContentItemId") REFERENCES "ContentItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentItem" ("content", "createdAt", "description", "id", "modifiedAt", "nextContentItemId", "title", "url") SELECT "content", "createdAt", "description", "id", "modifiedAt", "nextContentItemId", "title", "url" FROM "ContentItem";
DROP TABLE "ContentItem";
ALTER TABLE "new_ContentItem" RENAME TO "ContentItem";
CREATE UNIQUE INDEX "ContentItem_nextContentItemId_key" ON "ContentItem"("nextContentItemId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "averageDriveDurationMinutes" INTEGER NOT NULL,
    "goal" TEXT NOT NULL
);
INSERT INTO "new_User" ("averageDriveDurationMinutes", "email", "id", "name") SELECT "averageDriveDurationMinutes", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
