import { z } from 'zod';

export const transactionSchema = z.object({
  productId: z.number({
    required_error: 'Product ID is required',
    invalid_type_error: 'Product ID must be a number'
  }),
  
  type: z.enum(['INBOUND', 'OUTBOUND'], {
    errorMap: () => ({ message: 'Transaction type must be either INBOUND or OUTBOUND' })
  }),
  
  quantity: z.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number'
  })
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0'),
  
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .nullable()
});