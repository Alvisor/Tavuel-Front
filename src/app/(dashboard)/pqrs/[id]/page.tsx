"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  CalendarDays,
  MapPin,
  DollarSign,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageLoading } from "@/components/layout/page-loading";
import { PqrsStatusBadge } from "@/components/pqrs/pqrs-status-badge";
import { PqrsPriorityBadge } from "@/components/pqrs/pqrs-priority-badge";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getPqrsDetail, assignPqrs } from "@/lib/api/admin";
import { toast } from "sonner";
import type { PqrsTicket } from "@/lib/api/types";
import { MessageThread } from "./message-thread";
import { EvidenceComparison } from "./evidence-comparison";
import { ResolutionDialog } from "./resolution-dialog";
import { EscalationDialog } from "./escalation-dialog";

const typeLabels: Record<string, string> = {
  PETITION: "Petición",
  COMPLAINT: "Queja",
  CLAIM: "Reclamo",
  SUGGESTION: "Sugerencia",
};

export default function PqrsDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [resolveOpen, setResolveOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const { data: ticket, isLoading, error, refetch } = useFetch(
    () => getPqrsDetail(id) as Promise<PqrsTicket>,
    [id]
  );

  async function handleAssign() {
    setAssigning(true);
    try {
      await assignPqrs(id);
      toast.success("Ticket asignado exitosamente");
      refetch();
    } catch {
      toast.error("Error al asignar el ticket");
    } finally {
      setAssigning(false);
    }
  }

  if (isLoading) {
    return <PageLoading message="Cargando ticket..." />;
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6">
        <Link
          href="/pqrs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a PQRS
        </Link>
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            {error || "No se encontró el ticket"}
          </p>
        </div>
      </div>
    );
  }

  const booking = ticket.booking;
  const canResolve =
    ticket.status !== "RESOLVED" && ticket.status !== "CLOSED";
  const canEscalate =
    ticket.status !== "ESCALATED" &&
    ticket.status !== "RESOLVED" &&
    ticket.status !== "CLOSED";
  const canAssign = !ticket.assignedToId;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/pqrs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a PQRS
      </Link>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold">{ticket.radicado}</h1>
                    <PqrsStatusBadge status={ticket.status} />
                    <PqrsPriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {typeLabels[ticket.type] || ticket.type} &mdash;{" "}
                    {ticket.category}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(ticket.createdAt), "dd MMM yyyy, HH:mm", {
                    locale: es,
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="font-semibold mb-2">{ticket.subject}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  Cliente:{" "}
                  <strong className="text-foreground">
                    {ticket.createdBy
                      ? `${ticket.createdBy.firstName} ${ticket.createdBy.lastName}`
                      : "---"}
                  </strong>
                </span>
                <span>
                  Asignado:{" "}
                  <strong className="text-foreground">
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                      : "Sin asignar"}
                  </strong>
                </span>
              </div>
              {ticket.resolution && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-700">
                      Resolución ({ticket.resolutionType})
                    </p>
                    <p className="text-sm">{ticket.resolution}</p>
                    {ticket.refundAmount != null && ticket.refundAmount > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Monto reembolsado:{" "}
                        <strong>
                          ${Number(ticket.refundAmount).toLocaleString("es-CO")} COP
                        </strong>
                      </p>
                    )}
                    {ticket.resolvedAt && (
                      <p className="text-xs text-muted-foreground">
                        Resuelto el{" "}
                        {format(
                          new Date(ticket.resolvedAt),
                          "dd MMM yyyy, HH:mm",
                          { locale: es }
                        )}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Hilo de Mensajes</CardTitle>
            </CardHeader>
            <CardContent>
              <MessageThread
                messages={ticket.messages || []}
                ticketId={id}
                onMessageSent={refetch}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right panel (1/3) */}
        <div className="space-y-6">
          {/* Booking Info Card */}
          {booking && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Información del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium">
                      {booking.service?.name || booking.category?.name || "Servicio"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.description?.length > 80
                        ? `${booking.description.slice(0, 80)}...`
                        : booking.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>
                    {format(
                      new Date(booking.scheduledAt),
                      "dd MMM yyyy, HH:mm",
                      { locale: es }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="line-clamp-2">{booking.address}</span>
                </div>
                {booking.quotedPrice != null && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>
                      ${Number(booking.quotedPrice).toLocaleString("es-CO")} COP
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Proveedor:</span>
                  <span className="font-medium">
                    {booking.provider?.user
                      ? `${booking.provider.user.firstName} ${booking.provider.user.lastName}`
                      : "---"}
                  </span>
                </div>
                <Link href={`/bookings/${booking.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Ver Booking
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Evidence Gallery */}
          {booking?.evidences && booking.evidences.length > 0 && (
            <EvidenceComparison evidences={booking.evidences} />
          )}

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canAssign && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleAssign}
                  disabled={assigning}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {assigning ? "Asignando..." : "Asignarme este ticket"}
                </Button>
              )}
              {canResolve && (
                <Button
                  className="w-full justify-start"
                  onClick={() => setResolveOpen(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolver Ticket
                </Button>
              )}
              {canEscalate && (
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => setEscalateOpen(true)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Escalar Ticket
                </Button>
              )}
              {!canAssign && !canResolve && !canEscalate && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No hay acciones disponibles para este ticket.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <ResolutionDialog
        ticketId={id}
        open={resolveOpen}
        onOpenChange={setResolveOpen}
        onResolved={refetch}
      />
      <EscalationDialog
        ticketId={id}
        open={escalateOpen}
        onOpenChange={setEscalateOpen}
        onEscalated={refetch}
      />
    </div>
  );
}
