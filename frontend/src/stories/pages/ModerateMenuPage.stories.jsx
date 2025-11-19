import React from "react";
import ModerateMenuPage from "main/pages/ModerateMenuPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/Moderate/Menu",
  component: ModerateMenuPage,
};

const Template = () => <ModerateMenuPage />;

// === Admin / Moderator User ===
export const AdminUser = Template.bind({});
AdminUser.parameters = {
  msw: {
    http: {
      get: {
        "/api/currentUser": () =>
          HttpResponse.json(apiCurrentUserFixtures.adminUser),
        "/api/systemInfo": () =>
          HttpResponse.json(systemInfoFixtures.showingNeither),
      },
    },
  },
};

// === Regular User (should see Access Denied) ===
export const RegularUser = Template.bind({});
RegularUser.parameters = {
  msw: {
    http: {
      get: {
        "/api/currentUser": () =>
          HttpResponse.json(apiCurrentUserFixtures.userOnly),
        "/api/systemInfo": () =>
          HttpResponse.json(systemInfoFixtures.showingNeither),
      },
    },
  },
};
