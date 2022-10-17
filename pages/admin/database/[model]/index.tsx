import Layout from "@/components/Layout";
import SessionGuard from "@/components/SessionGuard";
import { modelToColumnMap } from "@/constants/columns";
import {
  DatabaseModel,
  DatabaseModelPluralDisplayNames,
} from "@/constants/models";
import { Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import { GetServerSideProps, NextPage } from "next";

export type DatabaseProps = {
  model: DatabaseModel;
};

const DatabaseModelPage: NextPage<DatabaseProps> = ({ model }) => {
  const title = DatabaseModelPluralDisplayNames[model] ?? "Veriler";
  const { height } = useViewportSize();

  return (
    <SessionGuard>
      {() => (
        <Layout>
          <Title>{title}</Title>

          <DataTable
            my={50}
            columns={modelToColumnMap[model]}
            minHeight={height / 2}
          />
        </Layout>
      )}
    </SessionGuard>
  );
};

export default DatabaseModelPage;

export const getServerSideProps: GetServerSideProps<DatabaseProps> = async (
  context
) => {
  const model = (context.query.model as string | undefined) ?? null;

  if (!model || !Object.keys(DatabaseModelPluralDisplayNames).includes(model)) {
    return { notFound: true };
  }

  return { props: { model: model as DatabaseModel } };
};
