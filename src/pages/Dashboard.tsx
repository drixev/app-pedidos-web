import { useState, useEffect } from "react";
import { apiService } from "@/services/pedidos.api";
import { Order, CreateOrderPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  RefreshCw,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import SessionBar from "@/components/SessionBar";
import OrderDetailDialog from "@/components/OrderDetailDialog";
import { CreateOrderDialog } from "@/components/CreateOrderDialog";
import { statusColors } from "@/lib/enum";

const emptyOrder: CreateOrderPayload = {
  nroOrder: "",
  client: "",
  createdAt: "",
  total: 0,
  status: "registered",
};

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<CreateOrderPayload>(emptyOrder);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAll();
      setOrders(data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openCreate = () => {
    setEditingOrder(null);
    setForm(emptyOrder);
    setDialogOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setForm({
      nroOrder: order.nroOrder,
      client: order.client,
      status: order.status,
      createdAt: order.createdAt,
      total: order.total,
    });
    setDialogOpen(true);
  };

  const openDetail = async (id: string) => {
    try {
      const order = await apiService.getById(id);
      setDetailOrder(order);
    } catch {
      toast.error("Failed to load order");
    }
  };

  const handleSave = async () => {
    if (!form.nroOrder.trim() || !form.createdAt.trim()) {
      toast.error("Title and assignee are required");
      return;
    }
    setSaving(true);
    try {
      if (editingOrder) {
        await apiService.update(editingOrder.id, form);
        toast.success("Order updated");
      } else {
        await apiService.create(form);
        toast.success("Order created");
      }
      setDialogOpen(false);
      fetchOrders();
    } catch {
      toast.error("Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.delete(id);
      toast.success("Order deleted");
      fetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.nroOrder.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.createdAt.toLowerCase().includes(search.toLowerCase()) ||
      o.status.includes(search.toLowerCase()),
  );

  const stats = {
    total: orders.length,
    registered: orders.filter((o) => o.status === "registered").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    deleted: orders.filter((o) => o.status === "deleted").length,
  };

  const actionsButtons = (order: Order) => (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => openDetail(order.id)}
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => openEdit(order)}
      >
        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleDelete(order.id)}
      >
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SessionBar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total, cls: "text-foreground" },
            { label: "Registered", value: stats.registered, cls: "text-warning" },
            {
              label: "In Progress",
              value: stats.in_progress,
              cls: "text-info",
            },
            { label: "Completed", value: stats.completed, cls: "text-success" },
            { label: "Deleted", value: stats.deleted, cls: "text-destructive" },
          ].map((s) => (
            <Card key={s.label} className="border-border bg-card">
              <CardContent className="p-4">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className={`font-mono text-2xl font-bold ${s.cls}`}>
                  {s.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <Card className="mb-4 border-border bg-card">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 font-mono text-sm bg-secondary border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                className="font-mono text-xs"
              >
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> refresh
              </Button>
              <Button
                size="sm"
                onClick={openCreate}
                className="font-mono text-xs"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> new order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-border bg-card overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center font-mono text-sm text-muted-foreground">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Nro Pedido
                      </TableHead>
                      <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Cliente
                      </TableHead>
                      <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                        Fecha
                      </TableHead>
                      <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                        Estado
                      </TableHead>
                      <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-border hover:bg-secondary/50 animate-slide-in"
                      >
                        <TableCell className="font-mono text-sm font-medium">
                          {order.nroOrder}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                          {order.client}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-mono text-xs ${statusColors[order.status]}`}
                          >
                            {order.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {actionsButtons(order)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Create Order Dialog */}
      <CreateOrderDialog
        dialogOpen={dialogOpen}
        editingOrder={editingOrder ? true : false}
        form={form}
        saving={saving}
        handleSave={handleSave}
        handleFormChange={(data) => {
          setForm(data);
        }}
        setDialogOpen={setDialogOpen}
      />

      {/* Detail Dialog */}
      <OrderDetailDialog
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
      />
    </div>
  );
};

export default Dashboard;
