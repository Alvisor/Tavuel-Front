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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getProviders, getVerificationQueue } from "@/lib/api/admin";
import { providerColumns } from "./columns";
import { verificationColumns } from "./verification-columns";
import { Search, Users, ShieldCheck } from "lucide-react";

export default function ProvidersPage() {
  // Tab 1 state - All providers
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("ALL");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Tab 2 state - Verification queue
  const [queuePagination, setQueuePagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data: providersData, isLoading: providersLoading } = useFetch(
    () =>
      getProviders({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        verificationStatus:
          verificationStatus !== "ALL" ? verificationStatus : undefined,
      }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      search,
      verificationStatus,
    ]
  );

  const { data: queueData, isLoading: queueLoading } = useFetch(
    () =>
      getVerificationQueue({
        page: queuePagination.pageIndex + 1,
        limit: queuePagination.pageSize,
      }),
    [queuePagination.pageIndex, queuePagination.pageSize]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proveedores"
        description="Gestión de proveedores de servicios y verificación"
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="gap-1.5">
            <Users className="h-4 w-4" />
            Todos los Proveedores
          </TabsTrigger>
          <TabsTrigger value="verification" className="gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Cola de Verificación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            columns={providerColumns}
            data={providersData?.data || []}
            pageCount={providersData?.meta?.totalPages || 0}
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            onPaginationChange={setPagination}
            isLoading={providersLoading}
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
                  value={verificationStatus}
                  onValueChange={(v) => {
                    setVerificationStatus(v);
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Estado de verificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los estados</SelectItem>
                    <SelectItem value="PENDING_DOCUMENTS">
                      Docs. Pendientes
                    </SelectItem>
                    <SelectItem value="DOCUMENTS_SUBMITTED">
                      Docs. Enviados
                    </SelectItem>
                    <SelectItem value="UNDER_REVIEW">En Revisión</SelectItem>
                    <SelectItem value="APPROVED">Aprobado</SelectItem>
                    <SelectItem value="REJECTED">Rechazado</SelectItem>
                    <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />
        </TabsContent>

        <TabsContent value="verification">
          <DataTable
            columns={verificationColumns}
            data={queueData?.data || []}
            pageCount={queueData?.meta?.totalPages || 0}
            pageIndex={queuePagination.pageIndex}
            pageSize={queuePagination.pageSize}
            onPaginationChange={setQueuePagination}
            isLoading={queueLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
