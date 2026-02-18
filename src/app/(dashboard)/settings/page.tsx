"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesTab } from "./categories-tab";
import { ConfigTab } from "./config-tab";
import { AdminsTab } from "./admins-tab";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración"
        description="Configuración general de la plataforma"
      />

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categorías y Servicios</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="config" className="mt-4">
          <ConfigTab />
        </TabsContent>
        <TabsContent value="admins" className="mt-4">
          <AdminsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
