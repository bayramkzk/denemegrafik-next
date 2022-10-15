import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { AdminUser, SessionUser, StudentUser } from "@/types/auth";
import { checkEnforcedRole, EnforcedRole } from "@/utils/role";
import { Alert, Loader } from "@mantine/core";
import { Role } from "@prisma/client";
import { IconAlertCircle } from "@tabler/icons";
import { GetServerSideProps } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

export type SessionGuardChildrenArgs<R extends EnforcedRole> = {
  session: Session;
  user: R extends undefined
    ? SessionUser
    : R extends typeof Role.STUDENT
    ? StudentUser
    : AdminUser;
};

export type SessionGuardProps<R extends EnforcedRole> = {
  enforcedRole?: R;
  children: (args: SessionGuardChildrenArgs<R>) => React.ReactNode;
};

export default function SessionGuard<R extends EnforcedRole>({
  enforcedRole,
  children,
}: SessionGuardProps<R>) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Loader
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  if (status === "unauthenticated") {
    return <Alert icon={<IconAlertCircle />}>Lütfen giriş yapınız!</Alert>;
  }

  if (
    status === "authenticated" &&
    checkEnforcedRole(session.user.role, enforcedRole)
  ) {
    const user = session.user as SessionGuardChildrenArgs<R>["user"];
    return <>{children({ session, user })}</>;
  }

  return (
    <Alert icon={<IconAlertCircle />}>
      Bu sayfayı görüntülemek için yetkiniz yok!
    </Alert>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
