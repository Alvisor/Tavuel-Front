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
import { getUsers } from "@/lib/api/admin";
import { userColumns } from "./columns";
import { Search } from "lucide-react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading } = useFetch(
    () =>
      getUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        role: role !== "ALL" ? role : undefined,
        status: status !== "ALL" ? status : undefined,
      }),
    [pagination.pageIndex, pagination.pageSize, search, role, status]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestión de usuarios de la plataforma"
      />

      <DataTable
        columns={userColumns}
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
                placeholder="Buscar por nombre, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={role}
              onValueChange={(v) => {
                setRole(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los roles</SelectItem>
                <SelectItem value="CLIENT">Cliente</SelectItem>
                <SelectItem value="PROVIDER">Proveedor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="INACTIVE">Inactivo</SelectItem>
                <SelectItem value="BANNED">Baneado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </div>
  );
}
