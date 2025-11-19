import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router";

export default function ModerateMenuPage() {
  const currentUser = useCurrentUser();

  const moderatorOptions =
    hasRole(currentUser, "ROLE_ADMIN") ||
    hasRole(currentUser, "ROLE_MODERATOR");

  if (!moderatorOptions) {
    return (
      <BasicLayout>
        <Container className="mt-4">
          <h2>Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </Container>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <Container className="mt-4">
        <h2>Moderation Menu</h2>
        <p>Select what you want to moderate:</p>

        <div className="d-flex flex-column gap-3 mt-4">
          <Button as={Link} to="/moderate/reviews" variant="primary">
            Moderate Reviews
          </Button>

          <Button as={Link} to="/moderate/aliases" variant="secondary">
            Moderate Aliases
          </Button>
        </div>
      </Container>
    </BasicLayout>
  );
}
