/*
  Warnings:

  - You are about to drop the `LearningTree` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningTreeNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "learningTree" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LearningTree";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LearningTreeNode";
PRAGMA foreign_keys=on;
