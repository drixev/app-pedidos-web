import { Order } from "@/types";

export const adaptResponseToDomain = (orderResponse: any): Order => {
    return {
        id: orderResponse.id,
        nroOrder: orderResponse.numeroPedido,
        client: orderResponse.client,
        createdAt: orderResponse.fecha,
        updatedAt: orderResponse.fecha,
        total: orderResponse.total,
        status: orderResponse.status
    }
}