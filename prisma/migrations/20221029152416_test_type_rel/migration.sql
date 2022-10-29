-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "typeName" TEXT NOT NULL DEFAULT 'TYT';

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_typeName_fkey" FOREIGN KEY ("typeName") REFERENCES "TestType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
