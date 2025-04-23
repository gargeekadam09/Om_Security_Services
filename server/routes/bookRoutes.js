const express = require('express');
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, serviceController.createService);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, serviceController.updateService);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, serviceController.deleteService);

module.exports = router;