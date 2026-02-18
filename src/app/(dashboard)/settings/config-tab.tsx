"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getSystemConfig, updateSystemConfig } from "@/lib/api/admin";

interface ConfigValues {
  commission_rate: string;
  min_booking_advance_hours: string;
  max_booking_advance_days: string;
  cancellation_window_hours: string;
  platform_fee_percentage: string;
}

export function ConfigTab() {
  const [config, setConfig] = useState<ConfigValues>({
    commission_rate: "",
    min_booking_advance_hours: "",
    max_booking_advance_days: "",
    cancellation_window_hours: "",
    platform_fee_percentage: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await getSystemConfig();
      const values: Record<string, string> = {};
      if (Array.isArray(data)) {
        data.forEach((item: { key: string; value: string }) => {
          values[item.key] = item.value;
        });
      } else if (data && typeof data === "object") {
        Object.assign(values, data);
      }
      setConfig((prev) => ({ ...prev, ...values }));
    } catch {
      toast.error("Error al cargar configuración");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSystemConfig({ ...config });
      toast.success("Configuración guardada exitosamente");
    } catch {
      toast.error("Error al guardar configuración");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando configuracion...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comisiones y Tarifas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tasa de Comisión (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.commission_rate}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    commission_rate: e.target.value,
                  }))
                }
                placeholder="15"
              />
              <p className="text-xs text-muted-foreground">
                Porcentaje que cobra la plataforma por cada servicio
              </p>
            </div>
            <div className="space-y-2">
              <Label>Tarifa de Plataforma (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.platform_fee_percentage}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    platform_fee_percentage: e.target.value,
                  }))
                }
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Tarifa adicional de servicio de plataforma
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Políticas de Reservas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Antelación Mínima (horas)</Label>
              <Input
                type="number"
                value={config.min_booking_advance_hours}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    min_booking_advance_hours: e.target.value,
                  }))
                }
                placeholder="2"
              />
              <p className="text-xs text-muted-foreground">
                Horas mínimas antes de una reserva
              </p>
            </div>
            <div className="space-y-2">
              <Label>Antelación Máxima (días)</Label>
              <Input
                type="number"
                value={config.max_booking_advance_days}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    max_booking_advance_days: e.target.value,
                  }))
                }
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground">
                Días máximos de anticipación para reservar
              </p>
            </div>
            <div className="space-y-2">
              <Label>Ventana de Cancelación (horas)</Label>
              <Input
                type="number"
                value={config.cancellation_window_hours}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    cancellation_window_hours: e.target.value,
                  }))
                }
                placeholder="24"
              />
              <p className="text-xs text-muted-foreground">
                Horas antes del servicio para cancelar sin penalización
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}
