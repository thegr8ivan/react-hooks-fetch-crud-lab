import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

// Setup mock server and lifecycle handlers for API calls
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  // Simulate clicking the "View Questions" button
  fireEvent.click(screen.queryByText(/View Questions/));

  // Wait for questions to be fetched and displayed
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for the questions to load
  await screen.findByText(/lorem testum 1/g);

  // Click "New Question" button to display the form
  fireEvent.click(screen.getByText("New Question"));

  // Fill in the form fields
  fireEvent.change(screen.getByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/), {
    target: { value: "1" },
  });

  // Submit the form
  fireEvent.submit(screen.getByText(/Add Question/));

  // Click "View Questions" to display the updated list
  fireEvent.click(screen.getByText(/View Questions/));

  // Ensure the new question is displayed along with the existing ones
  expect(await screen.findByText(/Test Prompt/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);

  // Simulate clicking the "View Questions" button
  fireEvent.click(screen.queryByText(/View Questions/));

  // Wait for the questions to load
  await screen.findByText(/lorem testum 1/g);

  // Click the delete button on the first question
  fireEvent.click(screen.queryAllByText("Delete")[0]);

  // Ensure the question is removed from the DOM
  await waitFor(() =>
    expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument()
  );

  // Double-check that the question is gone
  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);

  // Simulate clicking the "View Questions" button
  fireEvent.click(screen.queryByText(/View Questions/));

  // Wait for the second question to load
  const question = await screen.findByText(/lorem testum 2/g);
  expect(question).toBeInTheDocument();

  // Find the dropdown for the correct answer
  const dropdown = screen.getByLabelText(/Correct Answer/);

  // Ensure dropdown exists
  expect(dropdown).toBeInTheDocument();

  // Simulate selecting a new correct answer from the dropdown
  fireEvent.change(dropdown, { target: { value: "1" } });

  // Check if the dropdown value has been updated
  expect(dropdown.value).toBe("1");

  // Optionally verify that the state has updated
  await waitFor(() => {
    expect(screen.getByText(/lorem testum 2/g)).toBeInTheDocument();
  });
});
