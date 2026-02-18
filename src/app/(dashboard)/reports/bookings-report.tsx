"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CalendarDays, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getBookingsReport } from "@/lib/api/admin";

interface BookingsReportProps {
  startDate: string;
  endDate: string;
}

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "hsl(var(--chart-1))",
  QUOTED: "hsl(var(--chart-2))",
  ACCEPTED: "hsl(var(--chart-3))",
  IN_PROGRESS: "hsl(var(--chart-4))",
  COMPLETED: "hsl(var(--chart-5))",
  CANCELLED: "hsl(0 60% 50%)",
  DISPUTED: "hsl(0 80% 60%)",
};

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Solicitados",
  QUOTED: "Cotizados",
  ACCEPTED: "Aceptados",
  IN_PROGRESS: "En Progreso",
  COMPLETED: "Completados",
  CANCELLED: "Cancelados",
  DISPUTED: "Disputados",
};

export function BookingsReport({ startDate, endDate }: BookingsReportProps) {
  const { data, isLoading } = useFetch(
    () => getBookingsReport({ startDate, endDate }),
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

  const totalBookings = data?.total || 0;
  const completedBookings = data?.completed || 0;
  const cancelledBookings = data?.cancelled || 0;
  const statusDistribution = data?.statusDistribution || [];
  const dailyData = data?.daily || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reservas
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">Periodo seleccionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedBookings}</div>
            <p className="text-xs text-muted-foreground">
              {totalBookings > 0
                ? `${((completedBookings / totalBookings) * 100).toFixed(1)}%`
                : "0%"}{" "}
              del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledBookings}</div>
            <p className="text-xs text-muted-foreground">
              {totalBookings > 0
                ? `${((cancelledBookings / totalBookings) * 100).toFixed(1)}%`
                : "0%"}{" "}
              del total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) =>
                      `${STATUS_LABELS[status] || status}: ${count}`
                    }
                  >
                    {statusDistribution.map(
                      (entry: { status: string }, index: number) => (
                        <Cell
                          key={index}
                          fill={STATUS_COLORS[entry.status] || `hsl(${index * 60} 70% 50%)`}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      STATUS_LABELS[name] || name,
                    ]}
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
            <CardTitle>Reservas por Día</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("es-CO", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--chart-1))"
                    name="Reservas"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
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
