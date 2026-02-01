"use client";

import {
  CalendarCheck,
  DollarSign,
  UserPlus,
  MessageSquareWarning,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  href: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  href,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend === "up" && "text-emerald-600",
              trend === "down" && "text-red-600",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingDown className="h-3 w-3" />}
            {trendValue}
          </span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        Ver detalles
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

const stats: StatCardProps[] = [
  {
    title: "Bookings Activos",
    value: "128",
    description: "vs. ayer",
    icon: CalendarCheck,
    trend: "up",
    trendValue: "+12%",
    href: "/bookings",
  },
  {
    title: "Ingresos del Día",
    value: "$2,450,000",
    description: "vs. ayer",
    icon: DollarSign,
    trend: "up",
    trendValue: "+8.2%",
    href: "/payments",
  },
  {
    title: "Usuarios Nuevos",
    value: "34",
    description: "últimas 24h",
    icon: UserPlus,
    trend: "up",
    trendValue: "+5",
    href: "/users",
  },
  {
    title: "PQRS Abiertos",
    value: "7",
    description: "vs. ayer",
    icon: MessageSquareWarning,
    trend: "down",
    trendValue: "-3",
    href: "/pqrs",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de la plataforma Tavuel
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Chart placeholder */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Bookings esta semana
          </h3>
          <div className="mt-4 flex h-64 items-center justify-center rounded-md border border-dashed border-border">
            <p className="text-sm text-muted-foreground">
              Gráfico de bookings -- Integrar con Recharts
            </p>
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Actividad reciente
          </h3>
          <div className="mt-4 space-y-4">
            {[
              {
                text: "Nuevo booking #1024 creado",
                time: "Hace 5 min",
              },
              {
                text: "Proveedor Juan M. verificado",
                time: "Hace 12 min",
              },
              {
                text: "PQRS #892 resuelto",
                time: "Hace 30 min",
              },
              {
                text: "Pago $85,000 procesado",
                time: "Hace 1h",
              },
              {
                text: "Usuario nuevo: María L.",
                time: "Hace 2h",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <p className="text-sm">{activity.text}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
