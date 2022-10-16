-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_citizenId_fkey";

-- RenameForeignKey
ALTER TABLE "User" RENAME CONSTRAINT "User_citizenId_fkey" TO "user_student_fk";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "user_admin_fk" FOREIGN KEY ("citizenId") REFERENCES "Admin"("citizenId") ON DELETE RESTRICT ON UPDATE CASCADE;
