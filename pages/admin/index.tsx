import Layout from "@/components/Layout";
import SessionGuard from "@/components/SessionGuard";
import { Title } from "@mantine/core";
import { NextPage } from "next";

const AdminPage: NextPage = (props) => {
  return (
    <SessionGuard allowedRoles={["ADMIN", "SUPERADMIN"]}>
      {({ user }) => (
        <Layout>
          <Title>Admin Panel</Title>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default AdminPage;
