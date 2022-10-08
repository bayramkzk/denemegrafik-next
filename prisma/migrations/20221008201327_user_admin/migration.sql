/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[citizenId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `citizenId` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'STUDENT');

-- DropIndex
DROP INDEX "Admin_email_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "email",
DROP COLUMN "hash",
DROP COLUMN "name",
ADD COLUMN     "citizenId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STUDENT';

-- DropEnum
DROP TYPE "Permission";

-- CreateIndex
CREATE UNIQUE INDEX "Admin_citizenId_key" ON "Admin"("citizenId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User"("citizenId") ON DELETE RESTRICT ON UPDATE CASCADE;
