"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, ZoomIn } from "lucide-react";
import type { ProviderDocument } from "@/lib/api/types";

const documentTypeLabels: Record<string, string> = {
  CEDULA_FRONT: "Cédula Frontal",
  CEDULA_BACK: "Cédula Posterior",
  SELFIE_WITH_CEDULA: "Selfie con Cédula",
  RUT: "RUT",
  CERTIFICATION: "Certificación",
  ANTECEDENTES: "Antecedentes",
  BANK_CERTIFICATE: "Certificado Bancario",
};

const documentStatusBadge: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendiente",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  APPROVED: {
    label: "Aprobado",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  },
  REJECTED: {
    label: "Rechazado",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
};

interface DocumentViewerProps {
  documents: ProviderDocument[];
}

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState<ProviderDocument | null>(null);

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            No se han subido documentos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const typeLabel = documentTypeLabels[doc.type] || doc.type;
          const statusInfo = documentStatusBadge[doc.status];

          return (
            <Card key={doc.id} className="overflow-hidden">
              <div
                className="relative aspect-[4/3] cursor-pointer group bg-muted"
                onClick={() => setSelectedDoc(doc)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.url}
                  alt={typeLabel}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{typeLabel}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={statusInfo?.className}
                  >
                    {statusInfo?.label || doc.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <p className="text-xs text-muted-foreground">
                  Subido el{" "}
                  {format(new Date(doc.uploadedAt), "dd MMM yyyy, HH:mm", {
                    locale: es,
                  })}
                </p>
                {doc.reviewedAt && (
                  <p className="text-xs text-muted-foreground">
                    Revisado el{" "}
                    {format(
                      new Date(doc.reviewedAt),
                      "dd MMM yyyy, HH:mm",
                      { locale: es }
                    )}
                  </p>
                )}
                {doc.rejectionReason && (
                  <p className="mt-1 text-xs text-red-600">
                    Motivo: {doc.rejectionReason}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        open={!!selectedDoc}
        onOpenChange={(open) => {
          if (!open) setSelectedDoc(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDoc
                ? documentTypeLabels[selectedDoc.type] || selectedDoc.type
                : "Documento"}
            </DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedDoc.url}
                alt={
                  documentTypeLabels[selectedDoc.type] || selectedDoc.type
                }
                className="w-full rounded-md object-contain max-h-[70vh]"
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Subido el{" "}
                  {format(
                    new Date(selectedDoc.uploadedAt),
                    "dd MMM yyyy, HH:mm",
                    { locale: es }
                  )}
                </p>
                <Badge
                  variant="secondary"
                  className={
                    documentStatusBadge[selectedDoc.status]?.className
                  }
                >
                  {documentStatusBadge[selectedDoc.status]?.label ||
                    selectedDoc.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
