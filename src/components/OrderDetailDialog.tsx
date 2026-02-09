import { Order } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { statusColors } from "@/lib/enum";

interface Props {
  order: Order | null;
  onClose: () => void;
}


const OrderDetailDialog = ({ order, onClose }: Props) => {
  if (!order) return null;

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border font-mono sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg">{order.nroOrder}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="outline" className={`text-xs ${statusColors[order.status]}`}>
              {order.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="space-y-3 text-sm">
            <Row label="ID" value={order.id} />
            <Row label="NroOrder" value={order.nroOrder} />
            <Row label="Client" value={order.client} />
            <Row label="Created" value={new Date(order.createdAt).toLocaleString()} />
            <Row label="Total" value={`$${order.total.toFixed(2)}`} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="text-foreground break-all">{value}</span>
  </div>
);

export default OrderDetailDialog;
