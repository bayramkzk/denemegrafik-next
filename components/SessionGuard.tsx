import { Alert, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

export type SessionGuardProps = {
  children: (session: Session) => React.ReactNode;
};

const SessionGuard: React.FC<SessionGuardProps> = ({ children: builder }) => {
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

  if (status === "authenticated") {
    return <>{builder(session)}</>;
  }

  return null;
};

export default SessionGuard;
