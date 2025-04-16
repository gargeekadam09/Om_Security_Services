import React, { useState, useEffect } from 'react';
import { getBookById } from '../services/bookService';
import { isLoggedIn } from '../services/authService';
import { createSale } from '../services/saleService';

// Book images - same as in FeaturedBooks
const bookCovers = {
  'The Great Gatsby': 'https://m.media-amazon.com/images/I/41XMaCHkrgL._SY445_SX342_.jpg',
  'To Kill a Mockingbird': 'https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg',
  '1984': 'https://m.media-amazon.com/images/I/41aM4xOZxaL._SY445_SX342_.jpg',
  'Pride and Prejudice': 'https://m.media-amazon.com/images/I/41k29Fict8L._SY445_SX342_.jpg',
  'The Hobbit': 'https://m.media-amazon.com/images/I/5187ImdoA0L._SY445_SX342_.jpg'
};

const BookDetailPage = ({ bookId, onBack, onLogin }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  
  const userLoggedIn = isLoggedIn();

  useEffect(() => {
    const fetchBook = async () => {
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

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  // Helper function to safely format price
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  // Get a cover image for a book, or use a placeholder
  const getBookCover = (book) => {
    if (bookCovers[book.title]) {
      return bookCovers[book.title];
    }
    return `https://via.placeholder.com/300x450?text=${encodeURIComponent(book.title)}`;
  };

  const handlePurchase = async () => {
    if (!userLoggedIn) {
      setMessage({
        type: 'error',
        text: 'You need to log in to purchase books'
      });
      return;
    }
    
    if (!book || quantity < 1) {
      setMessage({
        type: 'error',
        text: 'Please select a valid quantity'
      });
      return;
    }
    
    try {
      setPurchasing(true);
      
      const saleData = {
        book_id: book.id,
        quantity: parseInt(quantity)
      };
      
      await createSale(saleData);
      
      setMessage({
        type: 'success',
        text: 'Book purchased successfully!'
      });
      
      // Update the displayed book stock
      setBook({
        ...book,
        stock: book.stock - quantity
      });
      
      setQuantity(1);
      setPurchasing(false);
    } catch (err) {
      console.error("Purchase error:", err);
      setMessage({
        type: 'error',
        text: err.message || 'Purchase failed. Please try again.'
      });
      setPurchasing(false);
    }
  };

  if (loading) return <div className="loading">Loading book details...</div>;
  if (error) return <div className="message error">{error}</div>;
  if (!book) return <div className="message">Book not found</div>;

  return (
    <div className="book-detail-page">
      <button className="btn-back" onClick={onBack}>
        &larr; Back to Books
      </button>
      
      <div className="book-detail-content">
        <div className="book-detail-image">
          <img 
            src={getBookCover(book)} 
            alt={book.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/300x450?text=${encodeURIComponent(book.title)}`;
            }}
          />
        </div>
        
        <div className="book-detail-info">
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">by {book.author}</h2>
          
          <div className="book-meta">
            <p className="book-isbn"><strong>ISBN:</strong> {book.isbn}</p>
            <p className="book-price"><strong>Price:</strong> ${formatPrice(book.price)}</p>
            <p className={`book-stock ${book.stock < 1 ? 'out-of-stock' : ''}`}>
              <strong>Availability:</strong> {book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
            </p>
          </div>
          
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          {book.stock > 0 ? (
            <div className="purchase-section">
              {userLoggedIn ? (
                <>
                  <div className="quantity-control">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={book.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <button 
                    className="btn-purchase"
                    onClick={handlePurchase}
                    disabled={purchasing || book.stock < 1}
                  >
                    {purchasing ? 'Processing...' : 'Purchase Now'}
                  </button>
                </>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to purchase this book</p>
                  <button 
                    className="btn-login"
                    onClick={onLogin}
                  >
                    Log In / Register
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="out-of-stock-message">
              This book is currently out of stock. Please check back later.
            </div>
          )}
          
          <div className="book-description">
            <h3>Book Description</h3>
            <p>
              {/* In a real app, this would come from your database */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;