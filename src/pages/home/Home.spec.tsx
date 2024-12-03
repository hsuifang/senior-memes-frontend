import { render, screen } from "@/lib/test-utils";
import Home from "./Home";

describe("Home", () => {
  it("should render", () => {
    // render home and expect to see the text "Home"
    render(<Home />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
