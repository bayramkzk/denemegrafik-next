import Layout from "@/components/Layout";
import ProfileTable from "@/components/ProfileTable";
import SessionGuard from "@/components/SessionGuard";
import { Stack, Text, Title } from "@mantine/core";
import { NextPage } from "next";

const AdminPage: NextPage = (props) => {
  return (
    <SessionGuard allowedRoles={["ADMIN", "SUPERADMIN"]}>
      {({ user }) => (
        <Layout>
          <Stack spacing="xl">
            <Title>Admin Panel</Title>

            <Text size="lg">
              Merhaba {user.profile.name}! Deneme Grafik admin paneline
              hoşgeldin!👋
            </Text>

            <ProfileTable />
          </Stack>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default AdminPage;
