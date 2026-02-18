"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, Star } from "lucide-react";
import Link from "next/link";
import type { Provider } from "@/lib/api/types";

const verificationBadge: Record<
  string,
  { label: string; className: string }
> = {
  APPROVED: {
    label: "Aprobado",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  REJECTED: {
    label: "Rechazado",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  DOCUMENTS_SUBMITTED: {
    label: "Docs. Enviados",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  UNDER_REVIEW: {
    label: "En Revisión",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  PENDING_DOCUMENTS: {
    label: "Docs. Pendientes",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  SUSPENDED: {
    label: "Suspendido",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  },
};

export const providerColumns: ColumnDef<Provider>[] = [
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
    header: "Verificación",
    cell: ({ row }) => {
      const status = row.original.verificationStatus;
      const badge = verificationBadge[status];
      return (
        <Badge variant="secondary" className={badge?.className}>
          {badge?.label || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Calificación",
    cell: ({ row }) => {
      const rating = Number(row.original.rating);
      return (
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">
            {rating > 0 ? rating.toFixed(1) : "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            ({row.original.totalReviews})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalBookings",
    header: "Reservas",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.totalBookings}</span>
    ),
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
    cell: ({ row }) => (
      <Link href={`/providers/${row.original.id}`}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];
