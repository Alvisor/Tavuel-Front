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
import { getPqrs } from "@/lib/api/admin";
import { pqrsColumns } from "./columns";
import { Search } from "lucide-react";

export default function PqrsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading } = useFetch(
    () =>
      getPqrs({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        status: status !== "ALL" ? status : undefined,
        type: type !== "ALL" ? type : undefined,
        priority: priority !== "ALL" ? priority : undefined,
      }),
    [pagination.pageIndex, pagination.pageSize, search, status, type, priority]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="PQRS"
        description="Peticiones, quejas, reclamos y sugerencias"
      />

      <DataTable
        columns={pqrsColumns}
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
                placeholder="Buscar por radicado, asunto..."
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
                <SelectItem value="OPEN">Abierto</SelectItem>
                <SelectItem value="IN_REVIEW">En Revisión</SelectItem>
                <SelectItem value="WAITING_RESPONSE">Esperando Respuesta</SelectItem>
                <SelectItem value="ESCALATED">Escalado</SelectItem>
                <SelectItem value="RESOLVED">Resuelto</SelectItem>
                <SelectItem value="REOPENED">Reabierto</SelectItem>
                <SelectItem value="CLOSED">Cerrado</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los tipos</SelectItem>
                <SelectItem value="PETITION">Petición</SelectItem>
                <SelectItem value="COMPLAINT">Queja</SelectItem>
                <SelectItem value="CLAIM">Reclamo</SelectItem>
                <SelectItem value="SUGGESTION">Sugerencia</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priority}
              onValueChange={(v) => {
                setPriority(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="MEDIUM">Media</SelectItem>
                <SelectItem value="LOW">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
