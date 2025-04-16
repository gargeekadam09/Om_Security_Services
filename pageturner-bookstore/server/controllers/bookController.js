const db = require('../config/db');

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM books');
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const [book] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    
    if (book.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(200).json(book[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, price, stock } = req.body;
    
    // Basic validation
    if (!title || !author || !isbn || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO books (title, author, isbn, price, stock) VALUES (?, ?, ?, ?, ?)',
      [title, author, isbn, price, stock || 0]
    );
    
    const [newBook] = await db.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newBook[0]);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, price, stock } = req.body;
    const bookId = req.params.id;
    
    // Check if book exists
    const [existingBook] = await db.query('SELECT * FROM books WHERE id = ?', [bookId]);
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await db.query(
      'UPDATE books SET title = ?, author = ?, isbn = ?, price = ?, stock = ? WHERE id = ?',
      [
        title || existingBook[0].title,
        author || existingBook[0].author,
        isbn || existingBook[0].isbn,
        price || existingBook[0].price,
        stock !== undefined ? stock : existingBook[0].stock,
        bookId
      ]
    );
    
    const [updatedBook] = await db.query('SELECT * FROM books WHERE id = ?', [bookId]);
    
    res.status(200).json(updatedBook[0]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    
    // Check if book exists
    const [existingBook] = await db.query('SELECT * FROM books WHERE id = ?', [bookId]);
    
    if (existingBook.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await db.query('DELETE FROM books WHERE id = ?', [bookId]);
    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};