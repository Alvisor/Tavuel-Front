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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { escalatePqrs } from "@/lib/api/admin";
import { toast } from "sonner";

interface EscalationDialogProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEscalated: () => void;
}

export function EscalationDialog({
  ticketId,
  open,
  onOpenChange,
  onEscalated,
}: EscalationDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!reason.trim()) {
      toast.error("Ingresa el motivo de la escalación");
      return;
    }

    setSubmitting(true);
    try {
      await escalatePqrs(ticketId, reason.trim());
      toast.success("Ticket escalado exitosamente");
      setReason("");
      onOpenChange(false);
      onEscalated();
    } catch {
      toast.error("Error al escalar el ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escalar Ticket</DialogTitle>
          <DialogDescription>
            Indica el motivo por el cual este ticket requiere escalación a un
            nivel superior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Motivo de escalación</Label>
            <Textarea
              placeholder="Describe por qué se escala este ticket..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px]"
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
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Escalando..." : "Escalar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
