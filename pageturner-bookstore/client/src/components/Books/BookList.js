import React, { useState, useEffect } from 'react';
import { getAllBooks, deleteBook } from '../../services/bookService';

const BookList = ({ onEdit, refreshTrigger, onAddNew, isAdmin }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [refreshTrigger]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch books');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        fetchBooks();
      } catch (err) {
        setError('Failed to delete book');
      }
    }
  };

  // Helper function to safely format price
  const formatPrice = (price) => {
    // Convert to number if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number
    if (isNaN(numPrice)) {
      return '0.00';
    }
    
    // Format with 2 decimal places
    return numPrice.toFixed(2);
  };

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="message error">{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2>Books List</h2>
        {isAdmin && onAddNew && (
          <button onClick={onAddNew}>Add New Book</button>
        )}
      </div>
      
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Price</th>
              <th>Stock</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>${formatPrice(book.price)}</td>
                <td>{book.stock > 0 ? book.stock : 'Out of stock'}</td>
                {isAdmin && (
                  <td>
                    <button onClick={() => onEdit(book)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookList;