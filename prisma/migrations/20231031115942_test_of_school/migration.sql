/*
  Warnings:

  - You are about to drop the column `schoolCount` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "schoolCount",
ADD COLUMN     "schoolId" INTEGER NOT NULL DEFAULT 349664;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
