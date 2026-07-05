import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("shows the fallback initials when the image cannot load", () => {
    render(
      <Avatar>
        <AvatarImage src="" alt="" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
