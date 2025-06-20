import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import UserProfile from "./UserProfile";

describe("UserProfile", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // it("Displays loading since no userID provided", async () => {
  //     render(<UserProfile />)
  //     expect(screen.getByText('Loading...')).toBeInTheDocument();
  // });

  it("Fetches and renders user profile", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        name: "John Doe",
        email: "john.doe@example.com",
        id: 4,
      }),
    });
    render(<UserProfile userId={4} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-find-by
    await waitFor(() =>
      expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    );
  });
});
