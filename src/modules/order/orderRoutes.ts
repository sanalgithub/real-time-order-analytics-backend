import express from 'express';
import * as orderController from './orderController';
import { createOrderValidator } from '../../validations/order/orderValidation';
import { validateRequest } from '../../middlewares/orderValidator';
import { createOrderRateLimiter } from '../../middlewares/rateLimiter';


const router = express.Router();

router.post('/', createOrderRateLimiter,createOrderValidator, validateRequest, orderController.createOrder);
router.get('/', orderController.getOrders);
router.patch('/:id/status', orderController.updateOrderStatus);
router.get('/analytics/sales-summary', orderController.getSalesSummary);

export default router;