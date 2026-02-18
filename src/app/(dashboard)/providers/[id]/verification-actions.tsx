"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { approveVerification, rejectVerification } from "@/lib/api/admin";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface VerificationActionsProps {
  providerId: string;
  currentStatus: string;
  onComplete: () => void;
}

export function VerificationActions({
  providerId,
  currentStatus,
  onComplete,
}: VerificationActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  async function handleApprove() {
    setIsApproving(true);
    try {
      await approveVerification(providerId);
      toast.success("Proveedor aprobado exitosamente");
      onComplete();
    } catch {
      toast.error("Error al aprobar al proveedor");
    } finally {
      setIsApproving(false);
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      toast.error("Debes ingresar un motivo de rechazo");
      return;
    }

    setIsRejecting(true);
    try {
      await rejectVerification(providerId, rejectionReason.trim());
      toast.success("Proveedor rechazado");
      setRejectOpen(false);
      setRejectionReason("");
      onComplete();
    } catch {
      toast.error("Error al rechazar al proveedor");
    } finally {
      setIsRejecting(false);
    }
  }

  return (
    <>
      <Card className="border-2 border-dashed border-primary/30">
        <CardHeader>
          <CardTitle className="text-base">Acciones de Verificación</CardTitle>
          <CardDescription>
            Estado actual:{" "}
            {currentStatus === "DOCUMENTS_SUBMITTED"
              ? "Documentos Enviados"
              : "En Revisión"}
            . Revisa los documentos y decide si aprobar o rechazar al
            proveedor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              {isApproving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Aprobar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRejectOpen(true)}
              disabled={isRejecting}
              className="gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              Rechazar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Proveedor</DialogTitle>
            <DialogDescription>
              Ingresa el motivo por el cual se rechaza la verificación del
              proveedor. Este mensaje será enviado al proveedor.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo del rechazo..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectOpen(false);
                setRejectionReason("");
              }}
              disabled={isRejecting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
              className="gap-1.5"
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
