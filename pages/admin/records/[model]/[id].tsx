import SessionGuard from "@/components/SessionGuard";
import { NextPage } from "next";

interface EditRecordPageProps {
  id: string;
}

const EditRecordPage: NextPage<EditRecordPageProps> = () => {
  return (
    <SessionGuard allowedRoles={["ADMIN", "SUPERADMIN"]}>
      {() => <div>Edit Record Page</div>}
    </SessionGuard>
  );
};

export default EditRecordPage;
