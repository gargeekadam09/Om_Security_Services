import React, { useState, useEffect } from 'react';
import { getAllBooks } from '../services/bookService';

// Book images - in a real app, these would come from your database
const bookCovers = {
  'The Great Gatsby': 'https://m.media-amazon.com/images/I/41XMaCHkrgL._SY445_SX342_.jpg',
  'To Kill a Mockingbird': 'https://m.media-amazon.com/images/I/51Z0nLAfLmL._SY445_SX342_.jpg',
  '1984': 'https://m.media-amazon.com/images/I/41aM4xOZxaL._SY445_SX342_.jpg',
  'Pride and Prejudice': 'https://m.media-amazon.com/images/I/41k29Fict8L._SY445_SX342_.jpg',
  'The Hobbit': 'https://m.media-amazon.com/images/I/5187ImdoA0L._SY445_SX342_.jpg'
};

const FeaturedBooks = ({ onViewBook }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllBooks();
        
        // Get only first 5 books or fewer for featuring
        const featuredBooks = data.slice(0, 5);
        setBooks(featuredBooks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
    return `https://via.placeholder.com/150x220?text=${encodeURIComponent(book.title)}`;
  };

  if (loading) return <div className="loading">Loading featured books...</div>;
  if (error) return <div className="message error">{error}</div>;
  if (books.length === 0) return <div className="message">No books available at the moment.</div>;

  return (
    <div className="featured-books">
      <h2>Featured Books</h2>
      <div className="book-grid">
        {books.map(book => (
          <div className="book-card" key={book.id}>
            <div className="book-cover">
              <img 
                src={getBookCover(book)} 
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/150x220?text=${encodeURIComponent(book.title)}`;
                }}
              />
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <p className="book-price">${formatPrice(book.price)}</p>
              <p className="book-stock">
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </p>
              <button 
                className="btn-view-book"
                onClick={() => onViewBook(book.id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBooks;