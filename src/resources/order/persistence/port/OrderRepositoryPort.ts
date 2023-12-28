import { Order } from "../../domain/Order";
import { OrderEntity } from "../order.entity";

export interface OrderRepositoryPort {
	save(order: Order): Promise<void>;
	update(id: string, order: Order): Promise<void>;
	get(id: string): Promise<OrderEntity | null>;
	list(initialDate: Date, endDate: Date): Promise<OrderEntity[]>;
}
