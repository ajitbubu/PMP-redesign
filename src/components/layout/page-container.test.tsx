import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageContainer } from "./page-container";

describe("PageContainer", () => {
  it("renders the title as an h1 alongside subtitle, actions and children", () => {
    render(
      <PageContainer title="Dashboard" subtitle="Your overview" actions={<button>Act</button>}>
        <p>Body</p>
      </PageContainer>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Your overview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Act" })).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("omits the heading block entirely when no title is given", () => {
    render(
      <PageContainer>
        <p>Just body</p>
      </PageContainer>,
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Just body")).toBeInTheDocument();
  });
});
