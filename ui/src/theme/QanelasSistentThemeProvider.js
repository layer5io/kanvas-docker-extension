import React, { useMemo } from "react";
import { ThemeProvider, useTheme, createTheme } from "@mui/material/styles";
import { SistentThemeProviderWithoutBaseLine } from "@sistent/sistent";

const FONT_STACK = {
  regular: '"Qanelas Soft Regular", "Roboto", "Helvetica", "Arial", sans-serif',
  medium: '"Qanelas Soft Medium", "Roboto", "Helvetica", "Arial", sans-serif',
  semibold: '"Qanelas Soft SemiBold", "Roboto", "Helvetica", "Arial", sans-serif',
  bold: '"Qanelas Soft Bold", "Roboto", "Helvetica", "Arial", sans-serif',
};

const VARIANT_FONT_MAP = {
  h1: FONT_STACK.bold,
  h2: FONT_STACK.bold,
  h3: FONT_STACK.semibold,
  h4: FONT_STACK.semibold,
  h5: FONT_STACK.medium,
  h6: FONT_STACK.medium,
  subtitle1: FONT_STACK.medium,
  subtitle2: FONT_STACK.medium,
  body1: FONT_STACK.regular,
  body2: FONT_STACK.regular,
//   button: FONT_STACK.semibold,
  caption: FONT_STACK.regular,
  overline: FONT_STACK.regular,
  textH1Bold: FONT_STACK.bold,
  textH2Medium: FONT_STACK.medium,
  textH3Medium: FONT_STACK.medium,
  textB1Regular: FONT_STACK.regular,
  textB2SemiBold: FONT_STACK.semibold,
  textB3Regular: FONT_STACK.regular,
  textL1Bold: FONT_STACK.bold,
  textL2Regular: FONT_STACK.regular,
  textC1Regular: FONT_STACK.regular,
  textC2Regular: FONT_STACK.regular,
};

const buildTypographyOverrides = (theme) => {
  if (!theme?.typography) {
    return {};
  }

  const variantOverrides = {};
  Object.entries(VARIANT_FONT_MAP).forEach(([variant, fontFamily]) => {
    if (theme.typography?.[variant]) {
      variantOverrides[variant] = {
        ...theme.typography[variant],
        fontFamily,
      };
    }
  });

  return {
    fontFamily: FONT_STACK.regular,
    allVariants: {
      ...(theme.typography.allVariants || {}),
      fontFamily: FONT_STACK.regular,
    },
    ...variantOverrides,
  };
};

// Align Sistent's underlying MUI theme with the Qanelas font stacks without touching other styling.
const ThemeBridge = ({ children }) => {
  const baseTheme = useTheme();
  const qanelasTheme = useMemo(
    () =>
      createTheme(baseTheme, {
        typography: buildTypographyOverrides(baseTheme),
      }),
    [baseTheme],
  );

  return <ThemeProvider theme={qanelasTheme}>{children}</ThemeProvider>;
};

const QanelasSistentThemeProvider = ({ children }) => (
  <SistentThemeProviderWithoutBaseLine>
    <ThemeBridge>{children}</ThemeBridge>
  </SistentThemeProviderWithoutBaseLine>
);

export default QanelasSistentThemeProvider;
export { QanelasSistentThemeProvider };
