import { Theme } from "@astryxdesign/core";
import { butterTheme } from "../themes/butter/butterTheme";
import { useTheme } from "../hooks/usetheme";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	return (
		<Theme theme={butterTheme} mode={theme}>
			{children}
		</Theme>
	);
}
