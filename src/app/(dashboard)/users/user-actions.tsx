"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Ban, CheckCircle, XCircle } from "lucide-react";
import type { User } from "@/lib/api/types";
import { UserDetailDialog } from "./user-detail-dialog";
import { UserStatusDialog } from "./user-status-dialog";

export function UserActions({ user }: { user: User }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<string>("");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDetailOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user.status !== "ACTIVE" && (
            <DropdownMenuItem
              onClick={() => {
                setTargetStatus("ACTIVE");
                setStatusOpen(true);
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activar
            </DropdownMenuItem>
          )}
          {user.status !== "INACTIVE" && (
            <DropdownMenuItem
              onClick={() => {
                setTargetStatus("INACTIVE");
                setStatusOpen(true);
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Desactivar
            </DropdownMenuItem>
          )}
          {user.status !== "BANNED" && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                setTargetStatus("BANNED");
                setStatusOpen(true);
              }}
            >
              <Ban className="mr-2 h-4 w-4" />
              Banear
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDetailDialog
        userId={user.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <UserStatusDialog
        user={user}
        targetStatus={targetStatus}
        open={statusOpen}
        onOpenChange={setStatusOpen}
      />
    </>
  );
}
