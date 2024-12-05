import { render, screen } from "@/lib/test-utils";
import Home from "./Home";

describe("Home", () => {
  // has a canva section for wrapping the image and text user interact

  it("should have a canvas section for wrapping the image and text user interact", () => {
    render(<Home />);
    expect(screen.getByTestId("canvas-section")).toBeInTheDocument();
  });
});
