/* eslint-disable @typescript-eslint/no-explicit-any */
// userTableConfig.ts
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: Date;
}

export const userData = (): User[] => [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    isActive: true,
    lastLogin: new Date("2023-04-10T08:30:00"),
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    isActive: true,
    lastLogin: new Date("2023-04-15T14:45:00"),
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    isActive: false,
    lastLogin: new Date("2023-03-20T11:20:00"),
  },
];

const columnHelper = createColumnHelper<User>();

export const userTableColumns = (): ColumnDef<User, any>[] => [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("lastLogin", {
    header: "Last Login",
    cell: (info) => info.getValue().toLocaleString(),
  }),
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex space-x-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">
          Edit
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">
          Delete
        </button>
      </div>
    ),
  },
];
