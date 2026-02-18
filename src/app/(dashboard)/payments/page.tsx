"use client";

import { useState } from "react";
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-tables/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getPayments } from "@/lib/api/admin";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Payment, PaymentStatus } from "@/lib/api/types";

const statusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  PENDING: { label: "Pendiente", variant: "secondary" },
  AUTHORIZED: { label: "Autorizado", variant: "outline" },
  CAPTURED: { label: "Capturado", variant: "default" },
  REFUNDED: { label: "Reembolsado", variant: "destructive" },
  PARTIALLY_REFUNDED: { label: "Reembolso Parcial", variant: "destructive" },
  FAILED: { label: "Fallido", variant: "destructive" },
  EXPIRED: { label: "Expirado", variant: "secondary" },
};

const paymentColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "bookingId",
    header: "Booking",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.bookingId.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => (
      <span className="font-medium">
        ${Number(row.original.amount).toLocaleString("es-CO")}
      </span>
    ),
  },
  {
    accessorKey: "commissionAmount",
    header: "Comisión",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        ${Number(row.original.commissionAmount).toLocaleString("es-CO")}
        <span className="ml-1 text-xs">
          ({(Number(row.original.commissionRate) * 100).toFixed(0)}%)
        </span>
      </span>
    ),
  },
  {
    accessorKey: "providerAmount",
    header: "Proveedor",
    cell: ({ row }) => (
      <span>
        ${Number(row.original.providerAmount).toLocaleString("es-CO")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const config = statusConfig[row.original.status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "method",
    header: "Método",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.method || "—"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), "dd MMM yyyy HH:mm", {
        locale: es,
      }),
  },
];

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading } = useFetch(
    () =>
      getPayments({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      }),
    [pagination.pageIndex, pagination.pageSize, statusFilter]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pagos"
        description="Historial de transacciones y pagos de la plataforma"
      />

      <DataTable
        columns={paymentColumns}
        data={data?.data || []}
        pageCount={data?.meta?.totalPages || 0}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        filterBar={
          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="AUTHORIZED">Autorizado</SelectItem>
                <SelectItem value="CAPTURED">Capturado</SelectItem>
                <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                <SelectItem value="FAILED">Fallido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
