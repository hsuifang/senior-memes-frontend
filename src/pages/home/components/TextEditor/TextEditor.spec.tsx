import { render, screen } from "@/lib/test-utils";
import { vi } from "vitest";
import TextEditor from "./TextEditor";
import { ITextInfo } from "@/pages/home/types/textEditor";

describe("TextEditor", () => {
  const mockTextInfo: ITextInfo = {
    id: "1",
    text: "Hello",
    x: 0,
    y: 0,
    fontSize: 20,
    color: "#000000",
  };

  const mockOnChange = vi.fn();
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders text editor with provided values", () => {
    render(<TextEditor textInfo={mockTextInfo} onChange={mockOnChange} />);
    // const colorInput = screen.getByRole("textbox", { name: /color/i });
    const colorInput = screen.getByTestId("color-input");
    expect(colorInput).toHaveValue(mockTextInfo.color);

    const fontSizeInput = screen.getByRole("spinbutton");
    expect(fontSizeInput).toHaveValue(mockTextInfo.fontSize.toString());

    const textInput = screen.getByRole("textbox");
    expect(textInput).toHaveValue(mockTextInfo.text);
  });
  // TODO: 1. calls onChange when text is changed
  // TODO: 2. calls onChange when color is changed
  // TODO: 3. calls onChange when fontSize is changed
  // TODO: 4. handles null textInfo gracefully
});
