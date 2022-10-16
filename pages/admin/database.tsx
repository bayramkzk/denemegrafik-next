import Layout from "@/components/Layout";
import SessionGuard from "@/components/SessionGuard";
import {
  DatabaseModel,
  DatabaseModelPluralDisplayNames,
} from "@/constants/models";
import { Title } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";

export type DatabaseProps = {
  model: DatabaseModel;
};

const Database: NextPage<DatabaseProps> = ({ model }) => {
  const title = DatabaseModelPluralDisplayNames[model] ?? "Veriler";
  return (
    <SessionGuard>
      {() => (
        <Layout>
          <Title>{title}</Title>
        </Layout>
      )}
    </SessionGuard>
  );
};

export default Database;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const model = (context.query.model as string | undefined) ?? null;

  if (model && !Object.keys(DatabaseModelPluralDisplayNames).includes(model)) {
    return { notFound: true };
  }

  return { props: { model } };
};
