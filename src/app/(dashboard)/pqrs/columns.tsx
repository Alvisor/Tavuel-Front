"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PqrsStatusBadge } from "@/components/pqrs/pqrs-status-badge";
import { PqrsPriorityBadge } from "@/components/pqrs/pqrs-priority-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye } from "lucide-react";
import Link from "next/link";
import type { PqrsTicket } from "@/lib/api/types";

const typeBadge: Record<string, { label: string; className: string }> = {
  PETITION: {
    label: "Petición",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  COMPLAINT: {
    label: "Queja",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  },
  CLAIM: {
    label: "Reclamo",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  SUGGESTION: {
    label: "Sugerencia",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
};

export const pqrsColumns: ColumnDef<PqrsTicket>[] = [
  {
    accessorKey: "radicado",
    header: "Radicado",
    cell: ({ row }) => (
      <span className="font-bold">{row.original.radicado}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const config = typeBadge[row.original.type];
      return (
        <Badge variant="secondary" className={config?.className}>
          {config?.label || row.original.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Asunto",
    cell: ({ row }) => {
      const subject = row.original.subject;
      return (
        <span title={subject}>
          {subject.length > 40 ? `${subject.slice(0, 40)}...` : subject}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <PqrsStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => <PqrsPriorityBadge priority={row.original.priority} />,
  },
  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => {
      const user = row.original.createdBy;
      if (!user) return <span className="text-muted-foreground">--</span>;
      return (
        <span>
          {user.firstName} {user.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Asignado",
    cell: ({ row }) => {
      const user = row.original.assignedTo;
      if (!user)
        return <span className="text-muted-foreground">Sin asignar</span>;
      return (
        <span>
          {user.firstName} {user.lastName}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "dd MMM yyyy", { locale: es }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/pqrs/${row.original.id}`}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];
