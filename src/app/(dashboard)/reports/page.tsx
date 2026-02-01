import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
        <p className="text-sm text-muted-foreground">
          Análisis y reportes de la plataforma
        </p>
      </div>

      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <div className="text-center">
          <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Reportes y gráficos</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí se mostrarán los reportes con gráficos interactivos de Recharts.
          </p>
        </div>
      </div>
    </div>
  );
}
