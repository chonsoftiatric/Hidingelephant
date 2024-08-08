"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { Prompt } from "./schema";

export const columns: ColumnDef<Prompt>[] = [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (prop) => {
      const status = prop.getValue();
      if (!status) {
        return null;
      }

      console.log(status);

      return (
        <Badge>
          <>{status}</>
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: (prop) => {
      const priority = prop.getValue();

      if (!priority) {
        return null;
      }

      return <>{priority}</>;
    },
  },
];
