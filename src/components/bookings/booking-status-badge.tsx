"use client";

import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/api/types";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  REQUESTED: {
    label: "Solicitado",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  QUOTED: {
    label: "Cotizado",
    className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  },
  ACCEPTED: {
    label: "Aceptado",
    className: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
  },
  PROVIDER_EN_ROUTE: {
    label: "En Camino",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  },
  IN_PROGRESS: {
    label: "En Progreso",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  EVIDENCE_UPLOADED: {
    label: "Evidencia",
    className: "bg-lime-100 text-lime-700 hover:bg-lime-100",
  },
  COMPLETED: {
    label: "Completado",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  DISPUTED: {
    label: "Disputado",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
};

interface BookingStatusBadgeProps {
  status: string;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config?.className}>
      {config?.label || status}
    </Badge>
  );
}
