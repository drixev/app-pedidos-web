import { Order, CreateOrderPayload, UpdateOrderPayload } from "@/types";

const ORDERS_KEY = "dev_crud_orders";

function getStoredOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) {
    const seed = generateSeedOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function generateSeedOrders(): Order[] {
  const statuses: Order["status"][] = ["registered", "in_progress", "completed", "deleted"];
  const pedidos = [
    "API Gateway Migration", "Database Indexing", "Auth Module Refactor",
    "CI/CD Pipeline Setup", "Logging Infrastructure", "Rate Limiter Implementation",
    "WebSocket Integration", "Cache Layer Optimization"
  ];
  return pedidos.map((pedido, i) => ({
    id: crypto.randomUUID(),
    nroOrder: `PED-${String(i + 1).padStart(3, "0")}-${pedido.split(" ")[0].toUpperCase()}`,
    client: ["Alice", "Bob", "Carol"][i % 3],
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - (8 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (4 - (i % 4)) * 86400000).toISOString(),
    total: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
  }));
}

export const apiService = {
  
  async getAll(): Promise<Order[]> {
    return getStoredOrders();
  },

  async getById(id: string): Promise<Order> {
    const order = getStoredOrders().find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const orders = getStoredOrders();
    const newOrder: Order = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    saveOrders(orders);
    return newOrder;
  },


  async update(id: string, payload: UpdateOrderPayload): Promise<Order> {
    const orders = getStoredOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");
    orders[idx] = { ...orders[idx], ...payload, updatedAt: new Date().toISOString() };
    saveOrders(orders);
    return orders[idx];
  },

  async delete(id: string): Promise<void> {
    const orders = getStoredOrders().filter((o) => o.id !== id);
    saveOrders(orders);
  },
};
