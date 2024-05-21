import { z } from "zod";

export const RegisterOrderDTOSchema = z.object({
	items: z.array(
		z.object({
			itemId: z.string(),
			quantity: z.number().min(1),
			unitPrice: z.number().optional(),
		})
	),
});

export type RegisterOrderDTO = z.infer<typeof RegisterOrderDTOSchema>;
