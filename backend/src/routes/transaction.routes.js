import { Router } from 'express';
import { validate } from '../middlewares/validator.js';
import { transactionSchema } from '../validators/transaction.validator.js';
import * as transactionController from '../controllers/transaction.controller.js';

const router = Router();

router.post('/', validate(transactionSchema), transactionController.createTransaction);
router.get('/', transactionController.getTransactions);

export default router;