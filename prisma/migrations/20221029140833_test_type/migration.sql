-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('TYT', 'AYT');

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "type" "TestType" NOT NULL DEFAULT 'TYT';
