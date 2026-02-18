"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getUserDetail } from "@/lib/api/admin";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserDetailDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
  userId,
  open,
  onOpenChange,
}: UserDetailDialogProps) {
  const { data: user, isLoading } = useFetch(
    () => (open ? getUserDetail(userId) : Promise.resolve(null)),
    [userId, open]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Usuario</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando usuario...</p>
          </div>
        ) : user ? (
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{user.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge variant="secondary">{user.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registrado</p>
                  <p className="font-medium">
                    {format(new Date(user.createdAt), "dd MMM yyyy HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
              {user.provider && (
                <div className="rounded-lg border p-4 mt-4">
                  <p className="text-sm font-medium mb-2">Perfil de Proveedor</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      Verificación:{" "}
                      <Badge variant="outline">
                        {user.provider.verificationStatus}
                      </Badge>
                    </div>
                    <div>Rating: {user.provider.rating}/5</div>
                    <div>Total bookings: {user.provider.totalBookings}</div>
                    <div>Total reseñas: {user.provider.totalReviews}</div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="mt-4">
              {(user.bookingsAsClient?.length ?? 0) > 0 ? (
                <div className="space-y-2">
                  {user.bookingsAsClient!.map(
                    (b: { id: string; status: string; scheduledAt: string; service?: { name: string } }) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {b.service?.name || "Servicio"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(b.scheduledAt), "dd MMM yyyy", {
                              locale: es,
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">{b.status}</Badge>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Sin bookings
                </p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              {(user.reviews?.length ?? 0) > 0 ? (
                <div className="space-y-2">
                  {user.reviews!.map(
                    (r: { id: string; rating: number; comment: string; createdAt: string }) => (
                      <div key={r.id} className="rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {"★".repeat(r.rating)}
                            {"☆".repeat(5 - r.rating)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(r.createdAt), "dd MMM yyyy", {
                              locale: es,
                            })}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{r.comment}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Sin reseñas
                </p>
              )}
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
