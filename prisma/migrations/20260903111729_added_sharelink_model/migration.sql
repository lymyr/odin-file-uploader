/*
  Warnings:

  - You are about to drop the column `scope` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "scope",
ADD COLUMN     "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "Scope";

-- CreateTable
CREATE TABLE "ShareLink" (
    "id" INTEGER NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_id_fkey" FOREIGN KEY ("id") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
