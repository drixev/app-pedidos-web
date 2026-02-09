export interface Order {
  id: string;
  nroOrder: string;
  client: string;
  createdAt: string;
  updatedAt?: string;
  total: number;
  status: "registered" | "in_progress" | "completed" | "deleted";
}

export interface CreateOrderPayload {
  nroOrder: string;
  client: string;
  createdAt: string;
  total: number;
  status: Order["status"];
}

export type UpdateOrderPayload = Partial<CreateOrderPayload>;

export interface AuthSession {
  token: string;
  user: { id: string; email: string; name: string };
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
