"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock } from "lucide-react";
import type { BookingStatusHistory, BookingStatus } from "@/lib/api/types";

const positiveStatuses: BookingStatus[] = [
  "QUOTED",
  "ACCEPTED",
  "PROVIDER_EN_ROUTE",
  "IN_PROGRESS",
  "EVIDENCE_UPLOADED",
  "COMPLETED",
];

const negativeStatuses: BookingStatus[] = ["CANCELLED", "DISPUTED"];

const statusLabels: Record<string, string> = {
  REQUESTED: "Solicitado",
  QUOTED: "Cotizado",
  ACCEPTED: "Aceptado",
  PROVIDER_EN_ROUTE: "En Camino",
  IN_PROGRESS: "En Progreso",
  EVIDENCE_UPLOADED: "Evidencia",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  DISPUTED: "Disputado",
};

function getDotColor(toStatus: BookingStatus): string {
  if (negativeStatuses.includes(toStatus)) return "bg-red-500";
  if (positiveStatuses.includes(toStatus)) return "bg-green-500";
  return "bg-gray-400";
}

function getLineColor(toStatus: BookingStatus): string {
  if (negativeStatuses.includes(toStatus)) return "bg-red-200";
  if (positiveStatuses.includes(toStatus)) return "bg-green-200";
  return "bg-gray-200";
}

interface BookingTimelineProps {
  timeline: BookingStatusHistory[];
}

export function BookingTimeline({ timeline }: BookingTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No hay historial de estados para esta reserva.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      {timeline.map((entry, index) => {
        const isLast = index === timeline.length - 1;
        const dotColor = getDotColor(entry.toStatus);
        const lineColor = getLineColor(entry.toStatus);

        return (
          <div key={entry.id} className="relative flex gap-4 pb-6">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={`absolute left-[9px] top-5 h-full w-0.5 ${lineColor}`}
              />
            )}

            {/* Dot */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={`h-5 w-5 rounded-full border-2 border-background ${dotColor}`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {entry.fromStatus && (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {statusLabels[entry.fromStatus] || entry.fromStatus}
                    </span>
                    <span className="text-xs text-muted-foreground">→</span>
                  </>
                )}
                <span className="text-sm font-medium">
                  {statusLabels[entry.toStatus] || entry.toStatus}
                </span>
              </div>

              {entry.user && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  por {entry.user.firstName} {entry.user.lastName}
                </p>
              )}

              <p className="mt-0.5 text-xs text-muted-foreground">
                {format(new Date(entry.createdAt), "dd MMM yyyy, HH:mm", {
                  locale: es,
                })}
              </p>

              {entry.note && (
                <p className="mt-1 text-xs text-muted-foreground italic rounded bg-muted px-2 py-1">
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
