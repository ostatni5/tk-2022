/**
 * @jest-environment jsdom
 */

 import "@testing-library/jest-dom";
 import Index from "../src/routes/index.svelte";
 import { render } from "@testing-library/svelte";

 describe("Test if Jest is working", () => {
	test("Welcome", () => {
	  const { getByText } = render(Index);
	  expect(getByText("Jest test text")).toBeInTheDocument();
	});
  });