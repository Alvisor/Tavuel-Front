"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, Star, ShieldCheck, Loader2 } from "lucide-react";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getProvidersReport } from "@/lib/api/admin";

interface ProvidersReportProps {
  startDate: string;
  endDate: string;
}

const VERIFICATION_COLORS: Record<string, string> = {
  APPROVED: "hsl(142 70% 45%)",
  PENDING_DOCUMENTS: "hsl(45 93% 47%)",
  DOCUMENTS_SUBMITTED: "hsl(200 70% 50%)",
  UNDER_REVIEW: "hsl(262 60% 50%)",
  REJECTED: "hsl(0 60% 50%)",
  SUSPENDED: "hsl(0 0% 50%)",
};

const VERIFICATION_LABELS: Record<string, string> = {
  APPROVED: "Aprobados",
  PENDING_DOCUMENTS: "Pendiente Docs",
  DOCUMENTS_SUBMITTED: "Docs Enviados",
  UNDER_REVIEW: "En Revisión",
  REJECTED: "Rechazados",
  SUSPENDED: "Suspendidos",
};

export function ProvidersReport({ startDate, endDate }: ProvidersReportProps) {
  const { data, isLoading } = useFetch(
    () => getProvidersReport({ startDate, endDate }),
    [startDate, endDate]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando reporte...</p>
      </div>
    );
  }

  const totalProviders = data?.totalProviders || 0;
  const verifiedProviders = data?.verifiedProviders || 0;
  const averageRating = data?.averageRating || 0;
  const verificationDistribution = data?.verificationDistribution || [];
  const topProviders = data?.topProviders || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proveedores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProviders}</div>
            <p className="text-xs text-muted-foreground">Registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Verificados</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedProviders}</div>
            <p className="text-xs text-muted-foreground">
              {totalProviders > 0
                ? `${((verifiedProviders / totalProviders) * 100).toFixed(1)}%`
                : "0%"}{" "}
              del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rating Promedio
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(averageRating).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">de 5.0 estrellas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Verificación</CardTitle>
          </CardHeader>
          <CardContent>
            {verificationDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={verificationDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    nameKey="status"
                  >
                    {verificationDistribution.map(
                      (entry: { status: string }, index: number) => (
                        <Cell
                          key={index}
                          fill={
                            VERIFICATION_COLORS[entry.status] ||
                            `hsl(${index * 60} 70% 50%)`
                          }
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      VERIFICATION_LABELS[name] || name,
                    ]}
                  />
                  <Legend
                    formatter={(value: string) =>
                      VERIFICATION_LABELS[value] || value
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                Sin datos
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            {topProviders.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead className="text-right">Reservas</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProviders.map(
                      (
                        provider: {
                          name: string;
                          totalBookings: number;
                          rating: number;
                          verified: boolean;
                        },
                        index: number
                      ) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {provider.name}
                              {provider.verified && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1"
                                >
                                  Verificado
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {provider.totalBookings}
                          </TableCell>
                          <TableCell className="text-right">
                            {Number(provider.rating).toFixed(1)}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                Sin datos
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
