import { UserRole } from "@/types/auth";
import { Alert, Loader } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

export type SessionGuardProps = {
  children: (session: Session) => React.ReactNode;
  allowedRoles?: UserRole[];
};

const SessionGuard: React.FC<SessionGuardProps> = ({
  children: builder,
  allowedRoles,
}) => {
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
    (allowedRoles === undefined || allowedRoles.includes(session.user.role))
  ) {
    return <>{builder(session)}</>;
  }

  return (
    <Alert icon={<IconAlertCircle />}>
      Bu sayfayı görüntülemek için yetkiniz yok!
    </Alert>
  );
};

export default SessionGuard;
