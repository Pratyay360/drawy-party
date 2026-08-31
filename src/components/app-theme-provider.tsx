import { Theme } from "@astryxdesign/core";
import { useTheme } from "../hooks/usetheme";
import { butterTheme } from "../themes/butter/butterTheme";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    return (
        <Theme theme={butterTheme} mode={theme}>
            {children}
        </Theme>
    );
}
