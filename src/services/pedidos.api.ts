import { Order, CreateOrderPayload, UpdateOrderPayload } from "@/types";
import { apiClient } from "./axiosInstance";
import { adaptResponseToDomain } from "./adapters/responseToDomain.adapt";
import { HttpStatusCode } from "axios";
import { ORDERS_KEY } from "./constants/keyStorage.contants";

async function getStoredOrders(): Promise<Order[]> {
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) {
    var response = await apiClient().get('/');

    var orders = Array(response.data).map(ord => adaptResponseToDomain(ord))

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return orders;
  }
  return JSON.parse(raw) as Order[];
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export const apiService = {

  async getAll(): Promise<Order[]> {
    return getStoredOrders();
  },

  async getById(id: string): Promise<Order> {
    const orders = await getStoredOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) {
      const orderFromDb = await apiClient().get(`/${id}`);
      if (!orderFromDb) throw new Error('Order not found');
      return adaptResponseToDomain(orderFromDb);
    }
    return order;
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const orders = await getStoredOrders();

    const payloadNewOrder = {
      numeroPedido: payload.nroOrder,
      cliente: payload.client,
      total: payload.total,
      estado: payload.status
    };

    const response = await apiClient().post('/', payloadNewOrder);

    if (response.status !== HttpStatusCode.Created) {
      throw new Error(response.data);
    }

    const newOrder = adaptResponseToDomain(response.data)

    orders.unshift(newOrder);
    saveOrders(orders);
    return newOrder;
  },


  async update(id: string, payload: UpdateOrderPayload): Promise<Order> {
    const orders = await getStoredOrders();

    const idx = orders.findIndex((o) => o.id === id);

    if (idx === -1) throw new Error("Order not found");

    const payloadUpdateOrder = {
      id: id,
      numeroPedido: payload.nroOrder,
      cliente: payload.client,
      total: payload.total,
      estado: payload.status
    };

    const response = await apiClient().put('/', payloadUpdateOrder);

    if (response.status !== HttpStatusCode.NoContent) {
      throw new Error(response.data);
    }

    orders[idx] = { ...orders[idx], ...payload, updatedAt: new Date().toISOString() };

    saveOrders(orders);

    return orders[idx];
  },

  async delete(id: string): Promise<void> {

    const response = await apiClient().delete(`/${id}`);

    if (response.status !== HttpStatusCode.NoContent) {
      throw new Error(response.data);
    }

    const orders = await getStoredOrders();
    const newOrders = orders.filter((o) => o.id !== id);
    saveOrders(newOrders);
  },
};
