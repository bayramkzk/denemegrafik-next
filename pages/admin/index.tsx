import Layout from "@/components/Layout";
import ProfileTable from "@/components/ProfileTable";
import SessionGuard from "@/components/SessionGuard";
import { Stack, Text, Title } from "@mantine/core";
import { NextPage } from "next";

const AdminPage: NextPage = () => {
  return (
    <SessionGuard allowedRoles={["ADMIN", "SUPERADMIN", "VIEWER"]}>
      {({ user }) => (
        <Layout>
          <Stack spacing="xl">
            <Title>Admin Panel</Title>

            <Text size="lg">
              Merhaba {user.name}! Deneme Grafik admin paneline hoşgeldin!👋
            </Text>

            <ProfileTable />
          </Stack>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default AdminPage;
