import {
	RegisterOrderDTO,
	RegisterOrderDTOSchema,
} from "./dto/RegisterOrderDto";
import { InvalidOrderInputError, OrderError } from "../../error/OrderError";
import { NextFunction, Request, Response } from "express";
import { RegisterOrderPort } from "@/application/usecase/interfaces/RegisterOrderPort";
import { ListOrdersPort } from "@/application/usecase/interfaces/ListOrdersPort";
import { UnexpectedError } from "@/error/ErrorBase";
import { DependencyRegistry } from "@/infra/DependencyRegistry";
import { Logger } from "@/infra/log/Logger";

export class OrderController {
	private readonly registerOrder: RegisterOrderPort;
	private readonly listOrders: ListOrdersPort;
	private readonly logger: Logger;

	constructor(readonly registry: DependencyRegistry) {
		this.registerOrder = registry.inject("registerOrder");
		this.listOrders = registry.inject("listOrders");
		this.logger = registry.inject("logger");
	}

	create = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		try {
			const registerOrderDTO: RegisterOrderDTO = req.body;
			const userId: string = "3a5e8426-8265-418b-9ade-a82d0f69ec42";

			this.logger.logUseCase(
				"RegisterOrder",
				`Payment method: ${
					registerOrderDTO.paymentMethod
				} / items: ${registerOrderDTO.items.reduce(
					(acc, item) => (acc += `\n| ${item.itemId} - ${item.quantity}`),
					""
				)}`
			);

			const schemaValidation =
				RegisterOrderDTOSchema.safeParse(registerOrderDTO);

			if (!schemaValidation.success)
				throw new InvalidOrderInputError(schemaValidation.error.issues);

			const order = await this.registerOrder.execute(registerOrderDTO, userId);

			return res.status(201).json(order);
		} catch (error) {
			next(error);
		}
	};

	list = async (req: Request, res: Response): Promise<any> => {
		try {
			const { startDate, endDate } = req.query;

			if (!startDate || !endDate) {
				const { httpCode, ...error } = new OrderError("REQUIRED_DATE_RANGE");
				res.status(httpCode).json(error);
			}

			const ordersOrError = await this.listOrders.execute(
				new Date(startDate as string),
				new Date(endDate as string)
			);

			if (ordersOrError instanceof OrderError) {
				const { httpCode, ...error } = ordersOrError;
				return res.status(httpCode).json(error);
			}

			res.status(200).json(ordersOrError);
		} catch (error) {
			console.log(error);

			const { httpCode, ...unexpectedErrorMessage } = new UnexpectedError();
			return res.status(httpCode).json(unexpectedErrorMessage);
		}
	};
}
