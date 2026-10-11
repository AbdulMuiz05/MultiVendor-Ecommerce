import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Eshop application", () => {
  render(<App />);
  expect(screen.getByText(/Eshop/i)).toBeInTheDocument();
});