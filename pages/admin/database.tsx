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

const DatabasePage: NextPage<DatabaseProps> = ({ model }) => {
  const title = DatabaseModelPluralDisplayNames[model] ?? "Veriler";
  const { height } = useViewportSize();

  return (
    <SessionGuard>
      {() => (
        <Layout>
          <Title>{title}</Title>

          {model ? (
            <DataTable
              my={50}
              columns={modelToColumnMap[model]}
              minHeight={height / 2}
            />
          ) : (
            <p>Model seçilmedi.</p>
          )}
        </Layout>
      )}
    </SessionGuard>
  );
};

export default DatabasePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const model = (context.query.model as string | undefined) ?? null;

  if (model && !Object.keys(DatabaseModelPluralDisplayNames).includes(model)) {
    return { notFound: true };
  }

  return { props: { model } };
};
