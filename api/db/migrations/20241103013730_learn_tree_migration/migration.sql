-- CreateTable
CREATE TABLE "LearningTree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "rootNodeId" TEXT NOT NULL,
    CONSTRAINT "LearningTree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LearningTree_rootNodeId_fkey" FOREIGN KEY ("rootNodeId") REFERENCES "LearningTreeNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LearningTreeNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topic" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    CONSTRAINT "LearningTreeNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LearningTreeNode" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningTree_userId_key" ON "LearningTree"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningTree_rootNodeId_key" ON "LearningTree"("rootNodeId");
