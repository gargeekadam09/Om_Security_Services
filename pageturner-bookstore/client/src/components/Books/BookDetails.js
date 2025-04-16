import React, { useState, useEffect } from 'react';
import { getBookById } from '../../services/bookService';

const BookDetails = ({ bookId, onBack }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getBookById(bookId);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book details');
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) return <div className="loading">Loading book details...</div>;
  if (error) return <div className="message error">{error}</div>;
  if (!book) return <div className="message">No book selected</div>;

  return (
    <div className="book-details">
      <h2>Book Details</h2>
      
      <div className="details-container">
        <div className="detail-row">
          <span className="detail-label">Title:</span>
          <span className="detail-value">{book.title}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Author:</span>
          <span className="detail-value">{book.author}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">ISBN:</span>
          <span className="detail-value">{book.isbn}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Price:</span>
          <span className="detail-value">${formatPrice(book.price)}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">In Stock:</span>
          <span className="detail-value">{book.stock} copies</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">Added on:</span>
          <span className="detail-value">{new Date(book.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <button onClick={onBack} style={{ marginTop: '20px' }}>
        Back to Book List
      </button>
    </div>
  );
};

export default BookDetails;