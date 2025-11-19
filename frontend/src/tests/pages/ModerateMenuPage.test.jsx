import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router";
import ModerateMenuPage from "main/pages/ModerateMenuPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("ModerateMenuPage Tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupAdmin = () => {
    axiosMock.reset();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupModerator = () => {
    axiosMock.reset();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.moderatorUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  test("shows menu for admin", async () => {
    setupAdmin();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ModerateMenuPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Moderation Menu")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /moderate reviews/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /moderate aliases/i }),
    ).toBeInTheDocument();
  });

  test("shows menu for moderator", async () => {
    setupModerator();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ModerateMenuPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Moderation Menu")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /moderate reviews/i }),
    ).toBeInTheDocument();
  });

  test("shows Access Denied for regular user", async () => {
    setupUserOnly();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ModerateMenuPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Access Denied")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: /moderate reviews/i }),
    ).not.toBeInTheDocument();
  });
});
