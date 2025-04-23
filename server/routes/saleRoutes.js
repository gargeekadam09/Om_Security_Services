const express = require('express');
const saleController = require('../controllers/saleController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware.optionalVerifyToken, saleController.getAllSales);
router.delete('/:id', authMiddleware.optionalVerifyToken, saleController.deleteSale);

router.post('/', authMiddleware.optionalVerifyToken, saleController.createSale);
router.get('/my-purchases', authMiddleware.optionalVerifyToken, saleController.getCustomerSales);

module.exports = router;