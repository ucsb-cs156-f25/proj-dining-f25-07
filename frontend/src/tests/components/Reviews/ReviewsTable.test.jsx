import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import ReviewsTable from "main/components/Reviews/ReviewsTable";
import { ReviewFixtures } from "fixtures/reviewFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";
import { vi } from "vitest";

const mockedNavigate = vi.fn();

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => mockedNavigate,
}));

describe("ReviewsTable tests", () => {
  const queryClient = new QueryClient();

  // Utility function for clean rendering
  const renderTable = (props) =>
    render(
      <QueryClientProvider client={queryClient}>
        <ReviewsTable reviews={ReviewFixtures.threeReviews} {...props} />
      </QueryClientProvider>,
    );

  test("Has the base column headers and content", () => {
    renderTable({ userOptions: false, moderatorOptions: false });

    expect(screen.getByText("Item Id")).toBeInTheDocument();
    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("Date Served")).toBeInTheDocument();
    expect(screen.getByText("Dining Commons Code")).toBeInTheDocument();

    expect(
      screen.getByTestId("Reviewstable-cell-row-0-col-item.id"),
    ).toBeInTheDocument();

    // ❌ Moderator buttons must NOT appear
    expect(
      screen.queryByTestId("Reviewstable-cell-row-0-col-Approve-button"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("Reviewstable-cell-row-0-col-Reject-button"),
    ).not.toBeInTheDocument();
  });

  // ⭐ MUTATION-KILLER TEST 1
  test("Moderator buttons do NOT appear when moderatorOptions is false", () => {
    renderTable({ userOptions: false, moderatorOptions: false });

    expect(
      screen.queryByTestId("Reviewstable-cell-row-0-col-Approve-button"),
    ).toBeNull();

    expect(
      screen.queryByTestId("Reviewstable-cell-row-0-col-Reject-button"),
    ).toBeNull();
  });

  test("Regular user buttons appear and work properly", async () => {
    renderTable({ userOptions: true, moderatorOptions: false });

    // edit button
    const editButton = screen.getByTestId(
      "Reviewstable-cell-row-0-col-Edit-button",
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    fireEvent.click(editButton);
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/reviews/edit/1"),
    );

    // delete button
    const deleteButton = screen.getByTestId(
      "Reviewstable-cell-row-0-col-Delete-button",
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/reviews/reviewer")
      .reply(200, { message: "Review deleted" });

    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });

  // ⭐ MUTATION-KILLER TEST 2
  test("Moderator buttons appear and work properly when moderatorOptions is true", async () => {
    renderTable({ userOptions: false, moderatorOptions: true });

    await waitFor(() => {
      expect(
        screen.getByTestId("Reviewstable-cell-row-0-col-item.id"),
      ).toHaveTextContent("7");
    });

    // approve button
    const approveButton = screen.getByTestId(
      "Reviewstable-cell-row-0-col-Approve-button",
    );
    expect(approveButton).toBeInTheDocument();
    expect(approveButton).toHaveClass("btn-primary");
    fireEvent.click(approveButton);

    // reject button
    const rejectButton = screen.getByTestId(
      "Reviewstable-cell-row-0-col-Reject-button",
    );
    expect(rejectButton).toBeInTheDocument();
    expect(rejectButton).toHaveClass("btn-danger");
    fireEvent.click(rejectButton);
  });

  test("Renders stars icons and formatted date correctly", () => {
    renderTable({ userOptions: false, moderatorOptions: false });

    const scoreCell = screen.getByTestId(
      "Reviewstable-cell-row-0-col-itemsStars",
    );
    expect(scoreCell).toHaveTextContent("⭐⭐⭐⭐");

    const review = ReviewFixtures.threeReviews[0];
    const formattedDate = new Date(review.dateItemServed).toLocaleDateString(
      "en-US",
    );
    const dateCell = screen.getByTestId(
      "Reviewstable-cell-row-0-col-dateItemServed",
    );
    expect(dateCell).toHaveTextContent(formattedDate);
  });
  test("Item Name cell renders correctly", () => {
    renderTable({ userOptions: false, moderatorOptions: false });

    const cell = screen.getByTestId("Reviewstable-cell-row-0-col-item.name");
    expect(cell).toHaveTextContent(ReviewFixtures.threeReviews[0].item.name);
  });

  test("Comments cell renders correctly", () => {
    renderTable({ userOptions: false, moderatorOptions: false });

    const cell = screen.getByTestId(
      "Reviewstable-cell-row-0-col-reviewerComments",
    );
    expect(cell).toHaveTextContent(
      ReviewFixtures.threeReviews[0].reviewerComments,
    );
  });

  test("Score stars render correctly for all rows", () => {
    renderTable({ userOptions: false, moderatorOptions: false });

    ReviewFixtures.threeReviews.forEach((review, idx) => {
      const cell = screen.getByTestId(
        `Reviewstable-cell-row-${idx}-col-itemsStars`,
      );
      const expectedStars = "⭐".repeat(review.itemsStars);
      expect(cell).toHaveTextContent(expectedStars);
    });
  });
});
