import { render, screen } from "@testing-library/react";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import RoleBadge from "main/components/Profile/RoleBadge";

describe("RoleBadge tests", () => {
  test("renders correct testid for ROLE_USER", async () => {
    render(
      <RoleBadge
        currentUser={currentUserFixtures.userOnly}
        role={"ROLE_USER"}
      />,
    );

    const badge = await screen.findByTestId("role-badge-user");
    expect(badge).toHaveAttribute("data-testid", "role-badge-user");
  });

  test("renders correct testid for ROLE_ADMIN", async () => {
    render(
      <RoleBadge
        currentUser={currentUserFixtures.adminUser}
        role={"ROLE_ADMIN"}
      />,
    );

    const badge = await screen.findByTestId("role-badge-admin");
    expect(badge).toHaveAttribute("data-testid", "role-badge-admin");
  });

  test("renders missing badge when user lacks ROLE_ADMIN", async () => {
    render(
      <RoleBadge
        currentUser={currentUserFixtures.userOnly}
        role={"ROLE_ADMIN"}
      />,
    );

    const missing = await screen.findByTestId("role-missing-admin");
    expect(missing).toHaveAttribute("data-testid", "role-missing-admin");
  });
});
