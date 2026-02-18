"use client";

import { Badge } from "@/components/ui/badge";

const priorityConfig: Record<string, { label: string; className: string }> = {
  HIGH: {
    label: "Alta",
    className: "bg-red-100 text-red-700 hover:bg-red-100",
  },
  MEDIUM: {
    label: "Media",
    className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  },
  LOW: {
    label: "Baja",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
  },
};

interface PqrsPriorityBadgeProps {
  priority: string;
}

export function PqrsPriorityBadge({ priority }: PqrsPriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge variant="secondary" className={config?.className}>
      {config?.label || priority}
    </Badge>
  );
}
