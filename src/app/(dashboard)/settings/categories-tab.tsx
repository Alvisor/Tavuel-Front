"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronRight, Power, Loader2 } from "lucide-react";
import { useFetch } from "@/lib/hooks/use-fetch";
import { getCategories, toggleCategory } from "@/lib/api/admin";
import { toast } from "sonner";
import type { ServiceCategory } from "@/lib/api/types";
import { CategoryDialog } from "./category-dialog";
import { ServiceDialog } from "./service-dialog";

export function CategoriesTab() {
  const { data: categories, isLoading, refetch } = useFetch(getCategories);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const handleToggle = async (id: string) => {
    try {
      await toggleCategory(id);
      toast.success("Estado de categoría actualizado");
      refetch();
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando categorias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCategoryDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {(categories as ServiceCategory[])?.map((cat) => (
        <Card key={cat.id}>
          <CardHeader
            className="cursor-pointer py-3"
            onClick={() =>
              setExpandedId(expandedId === cat.id ? null : cat.id)
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {expandedId === cat.id ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <CardTitle className="text-base">{cat.name}</CardTitle>
                <Badge variant={cat.isActive ? "default" : "secondary"}>
                  {cat.isActive ? "Activa" : "Inactiva"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {cat.services?.length || 0} servicios
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(cat.id);
                }}
              >
                <Power className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {expandedId === cat.id && (
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {cat.description}
              </p>
              <div className="space-y-2">
                {cat.services?.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between rounded-md border p-2 text-sm"
                  >
                    <div>
                      <span className="font-medium">{svc.name}</span>
                      {svc.basePrice && (
                        <span className="ml-2 text-muted-foreground">
                          $
                          {Number(svc.basePrice).toLocaleString("es-CO")}
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={svc.isActive ? "outline" : "secondary"}
                      className="text-xs"
                    >
                      {svc.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setServiceDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-3 w-3" />
                Agregar Servicio
              </Button>
            </CardContent>
          )}
        </Card>
      ))}

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onCreated={refetch}
      />
      <ServiceDialog
        categoryId={selectedCategoryId}
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
        onCreated={refetch}
      />
    </div>
  );
}
