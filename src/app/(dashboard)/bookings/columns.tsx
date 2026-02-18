"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import type { Booking } from "@/lib/api/types";

function formatCOP(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const bookingColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => {
      const client = row.original.client;
      if (!client) return "—";
      return (
        <div>
          <p className="font-medium">
            {client.firstName} {client.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{client.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "provider",
    header: "Proveedor",
    cell: ({ row }) => {
      const provider = row.original.provider;
      const user = provider?.user;
      if (!user) return "—";
      return (
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "service",
    header: "Servicio",
    cell: ({ row }) => {
      const service = row.original.service;
      return service?.name || "—";
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <BookingStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "scheduledAt",
    header: "Fecha Programada",
    cell: ({ row }) => {
      const date = row.original.scheduledAt;
      if (!date) return "—";
      return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es });
    },
  },
  {
    accessorKey: "quotedPrice",
    header: "Precio",
    cell: ({ row }) => formatCOP(row.original.quotedPrice),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link href={`/bookings/${row.original.id}`}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];
