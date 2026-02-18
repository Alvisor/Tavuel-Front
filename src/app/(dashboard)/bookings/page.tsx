"use client";

import { useState } from "react";
import { type PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-tables/data-table";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getBookings } from "@/lib/api/admin";
import { bookingColumns } from "./columns";
import { Search } from "lucide-react";

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading } = useFetch(
    () =>
      getBookings({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        status: status !== "ALL" ? status : undefined,
      }),
    [pagination.pageIndex, pagination.pageSize, search, status]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Gestion de reservas y servicios programados"
      />

      <DataTable
        columns={bookingColumns}
        data={data?.data || []}
        pageCount={data?.meta?.totalPages || 0}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        filterBar={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, proveedor..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                <SelectItem value="REQUESTED">Solicitado</SelectItem>
                <SelectItem value="QUOTED">Cotizado</SelectItem>
                <SelectItem value="ACCEPTED">Aceptado</SelectItem>
                <SelectItem value="PROVIDER_EN_ROUTE">En Camino</SelectItem>
                <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                <SelectItem value="EVIDENCE_UPLOADED">Evidencia</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
                <SelectItem value="DISPUTED">Disputado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
