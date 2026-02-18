"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: {
    label: "Abierto",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  IN_REVIEW: {
    label: "En Revisión",
    className: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  },
  WAITING_RESPONSE: {
    label: "Esperando Respuesta",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  ESCALATED: {
    label: "Escalado",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  RESOLVED: {
    label: "Resuelto",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
  REOPENED: {
    label: "Reabierto",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  },
  CLOSED: {
    label: "Cerrado",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
};

interface PqrsStatusBadgeProps {
  status: string;
}

export function PqrsStatusBadge({ status }: PqrsStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config?.className}>
      {config?.label || status}
    </Badge>
  );
}
