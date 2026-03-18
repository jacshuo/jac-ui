import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SideNav, type SideNavItem } from "../components/SideNav";

const items: SideNavItem[] = [
  { label: "Home", path: "/home", icon: <span>🏠</span> },
  { label: "About", path: "/about" },
  {
    label: "Settings",
    children: [
      { label: "Profile", path: "/settings/profile" },
      { label: "Security", path: "/settings/security" },
    ],
  },
];

describe("SideNav", () => {
  it("renders nav items", () => {
    render(<SideNav items={items} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders nested items when group is expanded", () => {
    render(<SideNav items={items} />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });

  it("collapses group on click", async () => {
    const user = userEvent.setup();
    render(<SideNav items={items} />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    await user.click(screen.getByText("Settings"));
    // After collapse, child should not be visible
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("renders links with correct href", () => {
    render(<SideNav items={items} basePath="" />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/home");
  });

  it("calls onItemClick when provided", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<SideNav items={items} onItemClick={onItemClick} />);
    await user.click(screen.getByText("Home"));
    expect(onItemClick).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Home" }),
      expect.any(String),
    );
  });

  it("renders title when provided", () => {
    render(<SideNav items={items} title="Navigation" />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<SideNav items={items} className="my-nav" />);
    expect(container.firstChild).toHaveClass("my-nav");
  });
});
