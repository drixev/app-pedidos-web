import { Order } from "@/types";

export const statusColors: Record<Order["status"], string> = {
  registered: "bg-warning/15 text-warning border-warning/30",
  in_progress: "bg-info/15 text-info border-info/30",
  completed: "bg-success/15 text-success border-success/30",
  deleted: "bg-destructive/15 text-destructive border-destructive/30",
};