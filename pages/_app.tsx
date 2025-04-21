import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import "../style/globals.scss";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  // Track page views when route changes (useful for analytics in the future)
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // We can add analytics tracking here in the future
      // console.log(`Page navigated to: ${url}`);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const theme = createTheme({
    palette: {
      type: resolvedTheme === "dark" ? "dark" : "light",
    },
  });

  return (
    <RecoilRoot>
      <NextThemeProvider defaultTheme="system">
        <ThemeProvider theme={theme}>
          <DefaultSeo
            defaultTitle="Dagens Dato - Dagens dato, ukenummer og historiske hendelser"
            description="Hvilken uke er det? Hva skjedde på dagens dato? Her finner du ut ting om dagens dato, med ett sammendrag over hva som har hendt på dagens dato."
            additionalMetaTags={[
              {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
              },
              {
                name: "keywords",
                content:
                  "dagens dato, ukenummer, historiske hendelser, fødsler, dødsfall, historie, dag, dato, uke, måned, år",
              },
            ]}
            openGraph={{
              type: "website",
              locale: "nb_NO",
              url: "https://www.dagensdato.no",
              site_name: "Dagens Dato",
              images: [
                {
                  url: "https://www.dagensdato.no/banner.png",
                  width: 3000,
                  height: 1055,
                  alt: "Dagens Dato",
                },
              ],
            }}
            twitter={{
              handle: "@dagensdato",
              site: "@dagensdato",
              cardType: "summary_large_image",
            }}
          />
          <Component {...pageProps} />
        </ThemeProvider>
      </NextThemeProvider>
    </RecoilRoot>
  );
};

export default MyApp;
