"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resolvePqrs } from "@/lib/api/admin";
import { toast } from "sonner";

const resolutionTypes: Record<string, string> = {
  FULL_REFUND: "Reembolso Total",
  PARTIAL_REFUND: "Reembolso Parcial",
  NO_REFUND: "Sin Reembolso",
  CREDIT: "Crédito",
  SUSPENSION: "Suspensión",
};

interface ResolutionDialogProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolved: () => void;
}

export function ResolutionDialog({
  ticketId,
  open,
  onOpenChange,
  onResolved,
}: ResolutionDialogProps) {
  const [resolutionType, setResolutionType] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [resolution, setResolution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const showRefundAmount =
    resolutionType === "FULL_REFUND" || resolutionType === "PARTIAL_REFUND";

  function resetForm() {
    setResolutionType("");
    setRefundAmount("");
    setResolution("");
  }

  async function handleSubmit() {
    if (!resolutionType || !resolution.trim()) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    if (showRefundAmount && !refundAmount) {
      toast.error("Ingresa el monto del reembolso");
      return;
    }

    setSubmitting(true);
    try {
      await resolvePqrs(ticketId, {
        resolutionType,
        refundAmount: showRefundAmount ? Number(refundAmount) : undefined,
        resolution: resolution.trim(),
      });
      toast.success("Ticket resuelto exitosamente");
      resetForm();
      onOpenChange(false);
      onResolved();
    } catch {
      toast.error("Error al resolver el ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resolver Ticket</DialogTitle>
          <DialogDescription>
            Selecciona el tipo de resolución y describe la solución aplicada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de resolución</Label>
            <Select value={resolutionType} onValueChange={setResolutionType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar tipo..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(resolutionTypes).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showRefundAmount && (
            <div className="space-y-2">
              <Label>Monto del reembolso (COP)</Label>
              <Input
                type="number"
                placeholder="0"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                min={0}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Descripción de la resolución</Label>
            <Textarea
              placeholder="Describe la resolución aplicada..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Resolviendo..." : "Resolver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
