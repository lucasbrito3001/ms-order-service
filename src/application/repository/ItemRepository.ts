import { Item } from "@/domain/entities/Item";
import { ItemEntity } from "@/infra/repository/entity/Item.entity";

export interface ItemRepository {
	save(item: Item): Promise<void>;
	get(ids: string[]): Promise<ItemEntity[]>;
}
