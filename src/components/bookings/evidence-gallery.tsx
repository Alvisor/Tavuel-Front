"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Evidence, EvidenceType } from "@/lib/api/types";
import { safeImageUrl } from "@/lib/utils";

const typeLabels: Record<EvidenceType, string> = {
  BEFORE: "Antes",
  DURING: "Durante",
  AFTER: "Despues",
  DISPUTE: "Disputa",
};

const typeOrder: EvidenceType[] = ["BEFORE", "DURING", "AFTER", "DISPUTE"];

interface EvidenceGalleryProps {
  evidences: Evidence[];
}

export function EvidenceGallery({ evidences }: EvidenceGalleryProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(
    null
  );

  if (!evidences || evidences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No hay evidencias para esta reserva.
        </p>
      </div>
    );
  }

  // Group evidences by type
  const grouped = typeOrder.reduce(
    (acc, type) => {
      const items = evidences.filter((e) => e.type === type);
      if (items.length > 0) {
        acc.push({ type, items });
      }
      return acc;
    },
    [] as { type: EvidenceType; items: Evidence[] }[]
  );

  return (
    <>
      <div className="space-y-4">
        {grouped.map(({ type, items }) => (
          <div key={type}>
            <h4 className="text-sm font-medium mb-2">{typeLabels[type]}</h4>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((evidence) => (
                <button
                  key={evidence.id}
                  type="button"
                  className="group relative aspect-square overflow-hidden rounded-md border bg-muted transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setSelectedEvidence(evidence)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={safeImageUrl(evidence.thumbnailUrl || evidence.url)}
                    alt={`Evidencia ${typeLabels[type]}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedEvidence}
        onOpenChange={(open) => {
          if (!open) setSelectedEvidence(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvidence
                ? `Evidencia - ${typeLabels[selectedEvidence.type]}`
                : "Evidencia"}
            </DialogTitle>
          </DialogHeader>
          {selectedEvidence && (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={safeImageUrl(selectedEvidence.url)}
                alt={`Evidencia ${typeLabels[selectedEvidence.type]}`}
                className="w-full rounded-md"
              />
              <p className="text-xs text-muted-foreground">
                Subida el{" "}
                {format(
                  new Date(selectedEvidence.createdAt),
                  "dd MMM yyyy, HH:mm",
                  { locale: es }
                )}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
