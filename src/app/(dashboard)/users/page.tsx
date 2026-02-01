import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de usuarios de la plataforma
        </p>
      </div>

      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <div className="text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Tabla de usuarios</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aquí se mostrará la tabla de usuarios con filtros y acciones.
          </p>
        </div>
      </div>
    </div>
  );
}
