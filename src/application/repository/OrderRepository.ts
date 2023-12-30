import { OrderEntity } from "@/infra/repository/entity/OrderEntity";
import { Order } from "../../domain/entities/Order";

export interface OrderRepository {
	save(order: Order): Promise<void>;
	get(id: string): Promise<OrderEntity | null>;
	list(initialDate: Date, endDate: Date): Promise<OrderEntity[]>;
}