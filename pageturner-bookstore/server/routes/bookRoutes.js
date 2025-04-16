const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Protected routes - admin only
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, bookController.createBook);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, bookController.updateBook);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, bookController.deleteBook);

module.exports = router;