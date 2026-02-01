import { MessageSquareWarning } from "lucide-react";

export default function PqrsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">PQRS</h1>
        <p className="text-sm text-muted-foreground">
          Peticiones, quejas, reclamos y sugerencias
        </p>
      </div>

      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <div className="text-center">
          <MessageSquareWarning className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Tabla de PQRS</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí se mostrará la tabla de PQRS con prioridad y seguimiento.
          </p>
        </div>
      </div>
    </div>
  );
}
