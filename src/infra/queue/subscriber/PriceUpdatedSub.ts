import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { QueueSubscriber } from "./QueueSubscriber";
import { Logger } from "@/infra/log/Logger";
import { BookStocked } from "@/domain/event/BookStocked";
import { RegisterItemCopy } from "@/application/usecase/RegisterItemCopy";

export class PriceUpdatedSub implements QueueSubscriber {
	public queueName = "priceUpdated";
	private readonly useCase: RegisterItemCopy;
	private logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.useCase = registry.inject("registerItemCopy");
		this.logger = registry.inject("logger");
	}

	private logMessage = (bookId: string): void => {
		this.logger.logEvent(
			"PriceUpdated",
			`Updating book ${bookId} price in the database`
		);
	};

	public callbackFunction = async (message: BookStocked) => {
		this.logMessage(message.bookId);
		this.useCase.execute(message);
	};
}
