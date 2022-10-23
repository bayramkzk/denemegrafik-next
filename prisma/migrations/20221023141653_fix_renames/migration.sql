/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `TestResult` table. All the data in the column will be lost.
  - You are about to drop the `TestOnOrganization` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `schoolId` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_groupId_fkey";

-- DropForeignKey
ALTER TABLE "TestOnOrganization" DROP CONSTRAINT "TestOnOrganization_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "TestOnOrganization" DROP CONSTRAINT "TestOnOrganization_testId_fkey";

-- DropForeignKey
ALTER TABLE "TestResult" DROP CONSTRAINT "TestResult_profileId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "organizationId",
ADD COLUMN     "schoolId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "groupId",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "profileId",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TestOnOrganization";

-- CreateTable
CREATE TABLE "TestOnSchool" (
    "testId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "TestOnSchool_pkey" PRIMARY KEY ("testId","schoolId")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestOnSchool" ADD CONSTRAINT "TestOnSchool_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestOnSchool" ADD CONSTRAINT "TestOnSchool_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
