import "@/styles/globals.css";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCookie, setCookie } from "cookies-next";
import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps as NextAppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

interface AppProps extends NextAppProps {
  colorScheme: ColorScheme;
  session: Session;
}

export default function App(props: AppProps) {
  const { Component, pageProps, session } = props;
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const mantineTheme: MantineThemeOverride = {
    colorScheme,
    colors: {
      primary: [
        "#d9fffb",
        "#adfcff",
        "#7ff3fb",
        "#50e7f8",
        "#24d9f5",
        "#0ab9db",
        "#009cab",
        "#00787c",
        "#004c4a",
        "#001c1a",
      ],
    },
    primaryColor: "primary",
    primaryShade: { light: 6, dark: 8 },
    loader: "dots",
  };

  return (
    <>
      <Head>
        <title>Deneme Grafik</title>
      </Head>

      <SessionProvider session={session}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={mantineTheme}
            withGlobalStyles
            withNormalizeCSS
          >
            <NotificationsProvider>
              <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
              </QueryClientProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
