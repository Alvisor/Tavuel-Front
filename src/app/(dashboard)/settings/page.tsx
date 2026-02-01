import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Configuración general de la plataforma
        </p>
      </div>

      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <div className="text-center">
          <Settings className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Configuración</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí se mostrará la configuración de la plataforma, comisiones, y ajustes generales.
          </p>
        </div>
      </div>
    </div>
  );
}
