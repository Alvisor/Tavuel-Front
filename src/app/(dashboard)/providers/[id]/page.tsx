"use client";

import { use } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { PageLoading } from "@/components/layout/page-loading";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getVerificationDetail } from "@/lib/api/admin";
import type { Provider } from "@/lib/api/types";
import { DocumentViewer } from "./document-viewer";
import { VerificationActions } from "./verification-actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ArrowLeft,
  User,
  FileText,
  Briefcase,
  CalendarDays,
  MessageSquare,
  Star,
  MapPin,
  Phone,
  Mail,
  Building2,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

const verificationBadge: Record<
  string,
  { label: string; className: string }
> = {
  APPROVED: {
    label: "Aprobado",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  REJECTED: {
    label: "Rechazado",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  DOCUMENTS_SUBMITTED: {
    label: "Docs. Enviados",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  UNDER_REVIEW: {
    label: "En Revisión",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  },
  PENDING_DOCUMENTS: {
    label: "Docs. Pendientes",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  },
  SUSPENDED: {
    label: "Suspendido",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  },
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: provider,
    isLoading,
    refetch,
  } = useFetch<Provider>(() => getVerificationDetail(id), [id]);

  if (isLoading) {
    return <PageLoading message="Cargando proveedor..." />;
  }

  if (!provider) {
    return (
      <div className="space-y-6">
        <PageHeader title="Proveedor no encontrado" />
        <p className="text-muted-foreground">
          No se pudo cargar la información del proveedor.
        </p>
        <Link href="/providers">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a proveedores
          </Button>
        </Link>
      </div>
    );
  }

  const user = provider.user;
  const bankAccount = provider.bankAccount;
  const statusBadge = verificationBadge[provider.verificationStatus];
  const showVerificationActions =
    provider.verificationStatus === "DOCUMENTS_SUBMITTED" ||
    provider.verificationStatus === "UNDER_REVIEW";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/providers">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {user?.firstName} {user?.lastName}
            </h1>
            <Badge variant="secondary" className={statusBadge?.className}>
              {statusBadge?.label || provider.verificationStatus}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Proveedor registrado el{" "}
            {format(new Date(provider.createdAt), "dd 'de' MMMM yyyy", {
              locale: es,
            })}
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-1.5">
            <Briefcase className="h-4 w-4" />
            Servicios
          </TabsTrigger>
          <TabsTrigger value="bookings" className="gap-1.5">
            <CalendarDays className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-1.5">
            <MessageSquare className="h-4 w-4" />
            Reseñas
          </TabsTrigger>
        </TabsList>

        {/* Perfil Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Información del Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <InfoRow
                  icon={User}
                  label="Nombre completo"
                  value={`${user?.firstName} ${user?.lastName}`}
                />
                <InfoRow icon={Mail} label="Email" value={user?.email} />
                <InfoRow
                  icon={Phone}
                  label="Teléfono"
                  value={user?.phone}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Registrado"
                  value={
                    user?.createdAt
                      ? format(
                          new Date(user.createdAt),
                          "dd MMM yyyy, HH:mm",
                          { locale: es }
                        )
                      : "—"
                  }
                />
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Información del Proveedor
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <InfoRow
                  icon={MapPin}
                  label="Dirección"
                  value={provider.address}
                />
                <InfoRow
                  icon={Star}
                  label="Calificación"
                  value={
                    Number(provider.rating) > 0
                      ? `${Number(provider.rating).toFixed(1)} / 5 (${provider.totalReviews} reseñas)`
                      : "Sin calificaciones"
                  }
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Total de reservas"
                  value={provider.totalBookings.toString()}
                />
                <InfoRow
                  icon={FileText}
                  label="Bio"
                  value={provider.bio}
                />
                {provider.approvedAt && (
                  <InfoRow
                    icon={CalendarDays}
                    label="Aprobado el"
                    value={format(
                      new Date(provider.approvedAt),
                      "dd MMM yyyy, HH:mm",
                      { locale: es }
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Bank Account */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Cuenta Bancaria</CardTitle>
              </CardHeader>
              <CardContent>
                {bankAccount ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoRow
                      icon={Building2}
                      label="Banco"
                      value={bankAccount.bankName}
                    />
                    <InfoRow
                      icon={CreditCard}
                      label="Tipo de cuenta"
                      value={bankAccount.accountType}
                    />
                    <InfoRow
                      icon={CreditCard}
                      label="Número de cuenta"
                      value={bankAccount.accountNumber}
                    />
                    <InfoRow
                      icon={User}
                      label="Titular"
                      value={bankAccount.accountHolder}
                    />
                    <InfoRow
                      icon={FileText}
                      label="Tipo de documento"
                      value={bankAccount.documentType}
                    />
                    <InfoRow
                      icon={FileText}
                      label="Número de documento"
                      value={bankAccount.documentNumber}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No se ha registrado información bancaria.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documentos Tab */}
        <TabsContent value="documents">
          <DocumentViewer documents={provider.documents || []} />
        </TabsContent>

        {/* Servicios Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Servicios del Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {provider.services && provider.services.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {provider.services.map((ps) => (
                    <Card key={ps.id} className="py-4">
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {ps.service?.name || "Servicio"}
                          </p>
                          <Badge
                            variant={ps.isActive ? "default" : "secondary"}
                          >
                            {ps.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {ps.service?.category?.name}
                        </p>
                        <p className="text-lg font-semibold">
                          ${Number(ps.price).toLocaleString("es-CO")}
                        </p>
                        {ps.description && (
                          <p className="text-xs text-muted-foreground">
                            {ps.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Este proveedor no tiene servicios registrados.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Historial de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total de reservas: {provider.totalBookings}. Consulta la
                sección de Bookings para ver el detalle completo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reseñas Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reseñas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">
                  {Number(provider.rating) > 0 ? Number(provider.rating).toFixed(1) : "—"}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({provider.totalReviews} reseñas)
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Las reseñas detalladas estarán disponibles próximamente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Verification Actions */}
      {showVerificationActions && (
        <VerificationActions
          providerId={provider.id}
          currentStatus={provider.verificationStatus}
          onComplete={refetch}
        />
      )}
    </div>
  );
}
