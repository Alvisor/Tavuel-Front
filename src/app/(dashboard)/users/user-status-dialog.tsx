"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserStatus } from "@/lib/api/admin";
import type { User } from "@/lib/api/types";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activar",
  INACTIVE: "Desactivar",
  BANNED: "Banear",
};

interface UserStatusDialogProps {
  user: User;
  targetStatus: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserStatusDialog({
  user,
  targetStatus,
  open,
  onOpenChange,
}: UserStatusDialogProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await updateUserStatus(
        user.id,
        targetStatus,
        targetStatus === "BANNED" ? reason : undefined
      );
      toast.success(
        `Usuario ${user.firstName} ${user.lastName} ha sido ${
          targetStatus === "ACTIVE"
            ? "activado"
            : targetStatus === "INACTIVE"
            ? "desactivado"
            : "baneado"
        }`
      );
      onOpenChange(false);
      setReason("");
      window.location.reload();
    } catch {
      toast.error("Error al cambiar el estado del usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {STATUS_LABELS[targetStatus] || "Cambiar estado"} usuario
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas{" "}
            {(STATUS_LABELS[targetStatus] || "cambiar").toLowerCase()} a{" "}
            <strong>
              {user.firstName} {user.lastName}
            </strong>
            ?
          </DialogDescription>
        </DialogHeader>

        {targetStatus === "BANNED" && (
          <div className="space-y-2">
            <Label htmlFor="reason">Razón del baneo</Label>
            <Textarea
              id="reason"
              placeholder="Describe la razón del baneo..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={targetStatus === "BANNED" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading || (targetStatus === "BANNED" && !reason.trim())}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
