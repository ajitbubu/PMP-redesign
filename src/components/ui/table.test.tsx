import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "./table";

describe("Table primitives", () => {
  it("defaults column headers to scope=col for correct screen-reader association", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jane</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Name")).toHaveAttribute("scope", "col");
  });

  it("lets a caller override scope for row headers", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHead scope="row">Row label</TableHead>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText("Row label")).toHaveAttribute("scope", "row");
  });
});
