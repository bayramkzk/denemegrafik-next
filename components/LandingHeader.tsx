import React from "react"
import { Group, Header } from "@mantine/core"
import { HEADER_HEIGHT } from "@/constants/index";
import AppLogo from "./AppLogo";
import Link from "next/link";

const LandingHeader: React.FC = () => {
  return <Header height={HEADER_HEIGHT} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Group noWrap>
      <Link href="/" passHref>
        <a>
          <AppLogo size={20} />
        </a>
      </Link>
    </Group>
  </Header>
};

export default LandingHeader;
