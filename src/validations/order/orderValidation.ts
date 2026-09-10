import { body } from 'express-validator';
import { OrderStatus } from '../../constants/enum';

export const createOrderValidator = [
  body('userId').isString().notEmpty().withMessage('Valid userId is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.productName')
    .isString()
    .notEmpty()
    .withMessage('Each item must have a valid productName'),
  body('items.*.qty')
    .isNumeric()
    .withMessage('Each item must have a valid qty')
    .custom((value) => {
      if (value < 1) {
        throw new Error('qty must be at least 1');
      }
      return true;
    }),
  body('items.*.price')
    .isNumeric()
    .withMessage('Each item must have a valid price')
    .custom((value) => {
      if (value < 0) {
        throw new Error('price must be 0 or greater');
      }
      return true;
    }),
  body('totalAmount')
    .isNumeric()
    .withMessage('Valid totalAmount is required')
    .custom((value) => {
      if (value < 0) {
        throw new Error('totalAmount must be 0 or greater');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(Object.values(OrderStatus))
    .withMessage(`status must be one of: ${Object.values(OrderStatus).join(', ')}`),
];