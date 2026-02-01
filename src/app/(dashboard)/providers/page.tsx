import { Wrench } from "lucide-react";

export default function ProvidersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de proveedores de servicios
        </p>
      </div>

      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <div className="text-center">
          <Wrench className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Tabla de proveedores</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí se mostrará la tabla de proveedores con verificación y estado.
          </p>
        </div>
      </div>
    </div>
  );
}
