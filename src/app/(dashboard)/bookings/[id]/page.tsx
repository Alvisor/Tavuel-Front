"use client";

import { use } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Wrench,
  CreditCard,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoading } from "@/components/layout/page-loading";
import { BookingStatusBadge } from "@/components/bookings/booking-status-badge";
import { BookingTimeline } from "@/components/bookings/booking-timeline";
import { EvidenceGallery } from "@/components/bookings/evidence-gallery";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getBookingDetail } from "@/lib/api/admin";
import type { Booking } from "@/lib/api/types";

function formatCOP(value: number | string | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return format(new Date(date), "dd MMM yyyy, HH:mm", { locale: es });
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: booking, isLoading } = useFetch<Booking>(
    () => getBookingDetail(id),
    [id]
  );

  if (isLoading) {
    return <PageLoading message="Cargando reserva..." />;
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <Link href="/bookings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            No se encontro la reserva.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/bookings">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            Reserva #{booking.id.slice(-8).toUpperCase()}
          </h1>
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking general info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informacion General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Descripcion
                  </dt>
                  <dd className="mt-1 text-sm">{booking.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Direccion
                  </dt>
                  <dd className="mt-1 text-sm">{booking.address}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fecha Programada
                  </dt>
                  <dd className="mt-1 text-sm">
                    {formatDate(booking.scheduledAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Creado
                  </dt>
                  <dd className="mt-1 text-sm">
                    {formatDate(booking.createdAt)}
                  </dd>
                </div>
                {booking.startedAt && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Iniciado
                    </dt>
                    <dd className="mt-1 text-sm">
                      {formatDate(booking.startedAt)}
                    </dd>
                  </div>
                )}
                {booking.completedAt && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Completado
                    </dt>
                    <dd className="mt-1 text-sm">
                      {formatDate(booking.completedAt)}
                    </dd>
                  </div>
                )}
                {booking.cancelledAt && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Cancelado
                    </dt>
                    <dd className="mt-1 text-sm">
                      {formatDate(booking.cancelledAt)}
                    </dd>
                  </div>
                )}
                {booking.cancellationReason && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Razon de Cancelacion
                    </dt>
                    <dd className="mt-1 text-sm">
                      {booking.cancellationReason}
                      {booking.cancelledBy && (
                        <span className="text-muted-foreground">
                          {" "}
                          (por {booking.cancelledBy})
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Client info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.client ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Nombre
                    </dt>
                    <dd className="mt-1 text-sm">
                      {booking.client.firstName} {booking.client.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm">{booking.client.email}</dd>
                  </div>
                  {booking.client.phone && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Telefono
                      </dt>
                      <dd className="mt-1 text-sm">{booking.client.phone}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Informacion del cliente no disponible.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Provider info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.provider?.user ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Nombre
                    </dt>
                    <dd className="mt-1 text-sm">
                      {booking.provider.user.firstName}{" "}
                      {booking.provider.user.lastName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm">
                      {booking.provider.user.email}
                    </dd>
                  </div>
                  {booking.provider.user.phone && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Telefono
                      </dt>
                      <dd className="mt-1 text-sm">
                        {booking.provider.user.phone}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Rating
                    </dt>
                    <dd className="mt-1 text-sm">
                      {Number(booking.provider.rating).toFixed(1)} / 5.0 (
                      {booking.provider.totalReviews} resenas)
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Proveedor aun no asignado.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Service info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.service ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Servicio
                    </dt>
                    <dd className="mt-1 text-sm">{booking.service.name}</dd>
                  </div>
                  {booking.category && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Categoria
                      </dt>
                      <dd className="mt-1 text-sm">
                        {booking.category.name}
                      </dd>
                    </div>
                  )}
                  {booking.service.basePrice != null && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Precio Base
                      </dt>
                      <dd className="mt-1 text-sm">
                        {formatCOP(booking.service.basePrice)}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Informacion del servicio no disponible.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              {booking.payment ? (
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Monto Total
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {formatCOP(booking.payment.amount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Estado
                    </dt>
                    <dd className="mt-1 text-sm">{booking.payment.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Comision ({(Number(booking.payment.commissionRate) * 100).toFixed(0)}%)
                    </dt>
                    <dd className="mt-1 text-sm">
                      {formatCOP(booking.payment.commissionAmount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Monto Proveedor
                    </dt>
                    <dd className="mt-1 text-sm">
                      {formatCOP(booking.payment.providerAmount)}
                    </dd>
                  </div>
                  {booking.payment.method && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Metodo
                      </dt>
                      <dd className="mt-1 text-sm">
                        {booking.payment.method}
                      </dd>
                    </div>
                  )}
                  {booking.payment.paidAt && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Fecha de Pago
                      </dt>
                      <dd className="mt-1 text-sm">
                        {formatDate(booking.payment.paidAt)}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <div className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Precio Cotizado
                    </dt>
                    <dd className="mt-1 text-sm font-medium">
                      {formatCOP(booking.quotedPrice)}
                    </dd>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No se ha registrado un pago para esta reserva.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidences */}
          <Card>
            <CardHeader>
              <CardTitle>Evidencias</CardTitle>
            </CardHeader>
            <CardContent>
              <EvidenceGallery evidences={booking.evidences || []} />
            </CardContent>
          </Card>
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Estados</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingTimeline timeline={booking.statusHistory || []} />
            </CardContent>
          </Card>

          {/* Review */}
          {booking.review && (
            <Card>
              <CardHeader>
                <CardTitle>Resena</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {Number(booking.review.rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                  </div>
                  <p className="text-sm">{booking.review.comment}</p>
                  {booking.review.client && (
                    <p className="text-xs text-muted-foreground">
                      por {booking.review.client.firstName}{" "}
                      {booking.review.client.lastName}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(booking.review.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
