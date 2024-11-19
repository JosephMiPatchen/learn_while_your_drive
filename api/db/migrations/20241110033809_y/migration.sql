/*
  Warnings:

  - Added the required column `currentTopics` to the `JobStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTopics` to the `JobStatus` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "totalTopics" INTEGER NOT NULL,
    "currentTopics" INTEGER NOT NULL
);
INSERT INTO "new_JobStatus" ("createdAt", "id", "status", "updatedAt", "userId") SELECT "createdAt", "id", "status", "updatedAt", "userId" FROM "JobStatus";
DROP TABLE "JobStatus";
ALTER TABLE "new_JobStatus" RENAME TO "JobStatus";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
