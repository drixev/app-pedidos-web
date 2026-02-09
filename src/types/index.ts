export interface Order {
  id: string;
  nroOrder: string;
  client: string;
  createdAt: string;
  updatedAt?: string;
  total: number;
  status: "registered" | "in_progress" | "completed" | "deleted";
  description?:string;
}

export interface CreateOrderPayload {
  nroOrder: string;
  client: string;
  total: number;
  status: Order["status"];
  description?:string;
}

export type UpdateOrderPayload = Partial<CreateOrderPayload>;

export interface AuthSession {
  token: string;
  user: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
