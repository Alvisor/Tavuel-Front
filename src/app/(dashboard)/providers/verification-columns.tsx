"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import type { Provider } from "@/lib/api/types";

const queueStatusBadge: Record<
  string,
  { label: string; className: string }
> = {
  DOCUMENTS_SUBMITTED: {
    label: "Docs. Enviados",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  UNDER_REVIEW: {
    label: "En Revisión",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
};

export const verificationColumns: ColumnDef<Provider>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const provider = row.original;
      const user = provider.user;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "verificationStatus",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.verificationStatus;
      const badge = queueStatusBadge[status];
      return (
        <Badge variant="secondary" className={badge?.className}>
          {badge?.label || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "documents",
    header: "Documentos",
    cell: ({ row }) => {
      const count = row.original.documents?.length || 0;
      return (
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{count} documento{count !== 1 ? "s" : ""}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Fecha de envío",
    cell: ({ row }) =>
      format(new Date(row.original.updatedAt), "dd MMM yyyy, HH:mm", {
        locale: es,
      }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/providers/${row.original.id}`}>
        <Button variant="outline" size="sm" className="gap-1.5">
          <ClipboardCheck className="h-4 w-4" />
          Revisar
        </Button>
      </Link>
    ),
  },
];
