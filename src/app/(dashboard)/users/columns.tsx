"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { User } from "@/lib/api/types";
import { UserActions } from "./user-actions";

const roleBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  CLIENT: { label: "Cliente", variant: "secondary" },
  PROVIDER: { label: "Proveedor", variant: "default" },
  ADMIN: { label: "Admin", variant: "outline" },
};

const statusBadge: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Activo", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
  INACTIVE: { label: "Inactivo", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
  BANNED: { label: "Baneado", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => row.original.phone || "—",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const r = roleBadge[row.original.role];
      return <Badge variant={r?.variant || "secondary"}>{r?.label || row.original.role}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const s = statusBadge[row.original.status];
      return (
        <Badge variant="secondary" className={s?.className}>
          {s?.label || row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registro",
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "dd MMM yyyy", { locale: es }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];
