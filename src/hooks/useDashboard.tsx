import { apiService } from "@/services/pedidos.api";
import { CreateOrderPayload, Order } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const emptyOrder: CreateOrderPayload = {
    nroOrder: "",
    client: "",
    total: 0,
    status: "registered",
};


export const useDashboard = () => {
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
        if (!form.nroOrder.trim()) {
            toast.error("Number of the Order is required");
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
        } catch (ex) {
            handleAxiosError(ex, "Failed to save order");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiService.delete(id);
            toast.success("Order deleted");
            fetchOrders();
        } catch (ex) {
            handleAxiosError(ex, "Failed to delete order")
        }
    };

    const filtered = loading ? [] : orders.filter(
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


    const handleAxiosError = (ex: unknown, msg?: string) => {
        if (axios.isAxiosError(ex) && ex.response) {
            const message =
                (typeof ex.response.data === "string"
                    ? ex.response.data
                    : (ex.response.data as any)?.message) || msg || "Unexpected error ocurred";
            toast.error(message);
        } else {
            toast.error(msg || "Unexpected error ocurred");
        }
    }

    return {
        stats,
        search,
        loading,
        filtered,
        dialogOpen,
        editingOrder,
        form,
        saving,
        detailOrder,
        fetchOrders,
        openDetail,
        openEdit,
        openCreate,
        handleSave,
        handleDelete,
        setForm,
        setSearch,
        setDetailOrder,
        setDialogOpen,
    }
}