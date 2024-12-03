import { render } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/theme";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };
