"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, CreditCard, Loader2 } from "lucide-react";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getRevenueReport } from "@/lib/api/admin";

interface RevenueReportProps {
  startDate: string;
  endDate: string;
}

export function RevenueReport({ startDate, endDate }: RevenueReportProps) {
  const { data, isLoading } = useFetch(
    () => getRevenueReport({ startDate, endDate }),
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

  const totalRevenue = data?.totalRevenue || 0;
  const totalCommission = data?.totalCommission || 0;
  const totalTransactions = data?.totalTransactions || 0;
  const dailyData = data?.daily || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(totalRevenue).toLocaleString("es-CO")}
            </div>
            <p className="text-xs text-muted-foreground">COP</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Comisiones Ganadas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Number(totalCommission).toLocaleString("es-CO")}
            </div>
            <p className="text-xs text-muted-foreground">COP</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transacciones
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Periodo seleccionado</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos Diarios</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                <YAxis
                  className="text-xs"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toLocaleString("es-CO")}`,
                    "Ingresos",
                  ]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("es-CO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  }
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[350px] items-center justify-center text-muted-foreground">
              No hay datos de ingresos para el periodo seleccionado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
