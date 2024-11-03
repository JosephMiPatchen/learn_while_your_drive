-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "averageDriveDurationMinutes" INTEGER NOT NULL,
    "goal" TEXT
);
INSERT INTO "new_User" ("averageDriveDurationMinutes", "email", "goal", "id", "name") SELECT "averageDriveDurationMinutes", "email", "goal", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
