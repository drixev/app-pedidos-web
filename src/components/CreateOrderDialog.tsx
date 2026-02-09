import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateOrderPayload, Order } from "@/types";

interface OrderDialogProps {
  dialogOpen: boolean;
  editingOrder: boolean;
  form: CreateOrderPayload;
  saving: boolean;
  handleSave: () => void;
  handleFormChange: (payload: CreateOrderPayload) => void;
  setDialogOpen: (open: boolean) => void;
}

export const CreateOrderDialog = (props: OrderDialogProps) => {
  const {
    dialogOpen,
    editingOrder,
    form,
    saving,
    setDialogOpen,
    handleSave,
    handleFormChange,
  } = props;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-card border-border font-mono sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">
            {editingOrder ? "Edit Order" : "New Order"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Title
            </Label>
            <Input
              value={form.nroOrder}
              onChange={(e) =>
                handleFormChange({ ...form, nroOrder: e.target.value })
              }
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Description
            </Label>
            <Textarea
              value={form.client}
              onChange={(e) =>
                handleFormChange({ ...form, client: e.target.value })
              }
              className="bg-secondary border-border min-h-[80px]"
            />
          </div>
          {editingOrder && (
            <div className="space-y-2">
              <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  handleFormChange({ ...form, status: v as Order["status"] })
                }
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Client
            </Label>
            <Input
              value={form.client}
              onChange={(e) =>
                handleFormChange({ ...form, client: e.target.value })
              }
              className="bg-secondary border-border"
              placeholder="email@dev.io"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            className="font-mono text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="font-mono text-xs"
          >
            {saving && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            {editingOrder ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
