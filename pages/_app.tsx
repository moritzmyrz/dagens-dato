import '@mui/lab/themeAugmentation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import type { AppProps } from 'next/app';
import React from 'react';
import { RecoilRoot } from 'recoil';
import '../style/globals.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const { resolvedTheme } = useTheme();

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: resolvedTheme === 'dark' ? 'dark' : 'light',
				},
				components: {},
			}),
		[resolvedTheme]
	);

	return (
		<RecoilRoot>
			<NextThemeProvider defaultTheme="system">
				<ThemeProvider theme={theme}>
					<Component {...pageProps} />
				</ThemeProvider>
			</NextThemeProvider>
		</RecoilRoot>
	);
};

export default MyApp;
