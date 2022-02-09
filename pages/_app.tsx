import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import type { AppProps } from 'next/app';
import React from 'react';
import { RecoilRoot } from 'recoil';
import '../style/globals.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const { resolvedTheme } = useTheme();

	const theme = createTheme({
		palette: {
			type: resolvedTheme === 'dark' ? 'dark' : 'light',
		},
	});
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
