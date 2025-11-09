import { Router } from 'express';
import { validate } from '../middlewares/validator.js';
import { productSchema } from '../validators/product.validator.js';
import * as productController from '../controllers/product.controller.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/', validate(productSchema), productController.createProduct);
router.put('/:id', validate(productSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;