"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Evidence } from "@/lib/api/types";
import { safeImageUrl } from "@/lib/utils";

interface EvidenceComparisonProps {
  evidences: Evidence[];
}

export function EvidenceComparison({ evidences }: EvidenceComparisonProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const beforeEvidences = evidences.filter((e) => e.type === "BEFORE");
  const afterEvidences = evidences.filter((e) => e.type === "AFTER");

  if (beforeEvidences.length === 0 && afterEvidences.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Comparación Antes / Después</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No hay evidencias de comparación</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Comparación Antes / Después</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Before */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Antes
              </p>
              {beforeEvidences.length === 0 ? (
                <div className="flex items-center justify-center h-24 rounded-md border border-dashed text-sm text-muted-foreground">
                  Sin evidencias
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {beforeEvidences.map((evidence) => (
                    <button
                      key={evidence.id}
                      onClick={() => setSelectedImage(evidence.url)}
                      className="relative aspect-square overflow-hidden rounded-md border hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <img
                        src={safeImageUrl(evidence.thumbnailUrl || evidence.url)}
                        alt="Evidencia antes"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* After */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Después
              </p>
              {afterEvidences.length === 0 ? (
                <div className="flex items-center justify-center h-24 rounded-md border border-dashed text-sm text-muted-foreground">
                  Sin evidencias
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {afterEvidences.map((evidence) => (
                    <button
                      key={evidence.id}
                      onClick={() => setSelectedImage(evidence.url)}
                      className="relative aspect-square overflow-hidden rounded-md border hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <img
                        src={safeImageUrl(evidence.thumbnailUrl || evidence.url)}
                        alt="Evidencia después"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogTitle className="sr-only">Evidencia ampliada</DialogTitle>
          {selectedImage && (
            <img
              src={safeImageUrl(selectedImage)}
              alt="Evidencia ampliada"
              className="w-full h-auto rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
