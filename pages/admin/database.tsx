import Layout from "@/components/Layout";
import SessionGuard from "@/components/SessionGuard";
import { modelToColumnMap } from "@/constants/columns";
import {
  DatabaseModel,
  DatabaseModelPluralDisplayNames,
} from "@/constants/models";
import { Title } from "@mantine/core";
import { DataGrid } from "mantine-data-grid";
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

          {model ? (
            <DataGrid
              my={50}
              data={[{}]}
              withGlobalFilter
              columns={modelToColumnMap[model]}
            />
          ) : (
            <p>Model seçilmedi.</p>
          )}
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
