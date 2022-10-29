/*
  Warnings:

  - You are about to drop the `TestOnSchool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestOnSchool" DROP CONSTRAINT "TestOnSchool_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "TestOnSchool" DROP CONSTRAINT "TestOnSchool_testId_fkey";

-- DropTable
DROP TABLE "TestOnSchool";
