-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LearningTree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "rootNodeId" TEXT,
    CONSTRAINT "LearningTree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LearningTree" ("createdAt", "id", "rootNodeId", "userId") SELECT "createdAt", "id", "rootNodeId", "userId" FROM "LearningTree";
DROP TABLE "LearningTree";
ALTER TABLE "new_LearningTree" RENAME TO "LearningTree";
CREATE UNIQUE INDEX "LearningTree_userId_key" ON "LearningTree"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
