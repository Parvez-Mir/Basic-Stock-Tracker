import { z } from 'zod';

export const productSchema = z.object({
  sku: z.string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must be less than 50 characters')
    .regex(/^[A-Za-z0-9-_]+$/, 'SKU can only contain letters, numbers, hyphens and underscores'),
  
  name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters')
    .trim(),
  
  unitPrice: z.number()
    .positive('Unit price must be greater than 0')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').transform(Number))
});