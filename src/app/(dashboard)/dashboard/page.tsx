"use client";

import {
  CalendarCheck,
  DollarSign,
  UserPlus,
  MessageSquareWarning,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoading } from "@/components/layout/page-loading";
import { BookingsLineChart } from "@/components/charts/bookings-line-chart";
import { StatusPieChart } from "@/components/charts/status-pie-chart";
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getDashboardStats } from "@/lib/api/admin";
import type { StatValue } from "@/lib/api/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatChange(change: number | undefined, isMoney = false) {
  if (change === undefined || change === 0)
    return { text: "Sin cambios", trend: "neutral" as const };
  const prefix = change > 0 ? "+" : "";
  const text = isMoney ? `${prefix}${formatCOP(change)}` : `${prefix}${change}`;
  return {
    text,
    trend: change > 0 ? ("up" as const) : ("down" as const),
  };
}

function mergeWeeklyData(
  current: { date: string; count: number }[],
  previous: { date: string; count: number }[]
) {
  const maxLen = Math.max(current.length, previous.length);
  return Array.from({ length: maxLen }, (_, i) => ({
    date: current[i]?.date || previous[i]?.date || "",
    count: current[i]?.count || 0,
    previousCount: previous[i]?.count || 0,
  }));
}

export default function DashboardPage() {
  const { data, isLoading } = useFetch(getDashboardStats);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Resumen general de la plataforma Tavuel
          </p>
        </div>
        <PageLoading message="Cargando dashboard..." />
      </div>
    );
  }

  const { stats, charts, recentActivity } = data;

  const statCards: {
    title: string;
    stat: StatValue;
    isMoney?: boolean;
    icon: React.ElementType;
    href: string;
  }[] = [
    {
      title: "Bookings Activos",
      stat: stats.activeBookings,
      icon: CalendarCheck,
      href: "/bookings",
    },
    {
      title: "Ingresos del Día",
      stat: stats.todayRevenue,
      isMoney: true,
      icon: DollarSign,
      href: "/payments",
    },
    {
      title: "Usuarios Nuevos",
      stat: stats.newUsersToday,
      icon: UserPlus,
      href: "/users",
    },
    {
      title: "PQRS Abiertos",
      stat: stats.openPqrs,
      icon: MessageSquareWarning,
      href: "/pqrs",
    },
  ];

  const summaryCards = [
    {
      title: "Verificaciones Pendientes",
      value: stats.pendingVerifications.value,
      icon: ShieldCheck,
      href: "/providers",
    },
    {
      title: "Total Usuarios",
      value: stats.totalUsers.value,
      icon: Users,
      href: "/users",
    },
    {
      title: "Proveedores Activos",
      value: stats.totalProviders.value,
      icon: Wrench,
      href: "/providers",
    },
  ];

  const weeklyData = mergeWeeklyData(
    charts.weeklyBookings.currentWeek,
    charts.weeklyBookings.previousWeek
  );

  const revenueData = charts.dailyRevenue.map((d) => ({
    date: d.date,
    revenue: d.total,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de la plataforma Tavuel
        </p>
      </div>

      {/* Main stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const change = formatChange(card.stat.change, card.isMoney);
          const displayValue = card.isMoney
            ? formatCOP(card.stat.value)
            : card.stat.value.toString();
          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                    <card.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold tracking-tight">
                    {displayValue}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-xs font-medium",
                        change.trend === "up" && "text-emerald-600",
                        change.trend === "down" && "text-red-600",
                        change.trend === "neutral" && "text-muted-foreground"
                      )}
                    >
                      {change.trend === "up" && (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {change.trend === "down" && (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {change.text}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs. ayer
                    </span>
                  </div>
                </div>
                <Link
                  href={card.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Ver detalles
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-xl font-bold">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <BookingsLineChart data={weeklyData} />
        </div>
        <div className="lg:col-span-3">
          <StatusPieChart data={charts.statusDistribution} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueBarChart data={revenueData} />
        </div>
        {/* Recent activity */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Actividad reciente
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm">{activity.message}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.time), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay actividad reciente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
