import React, { useState, useEffect } from 'react';
import { getCustomerSales } from '../../services/saleService';
import { getAllBooks } from '../../services/bookService';
import { createSale } from '../../services/saleService';

const CustomerDashboard = ({ user }) => {
  const [purchases, setPurchases] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  // Purchase form state
  const [selectedBook, setSelectedBook] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Helper function to safely format price
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  useEffect(() => {
    console.log("CustomerDashboard mounted, user:", user);
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get all available books
        const booksData = await getAllBooks();
        console.log("Books fetched:", booksData);
        setBooks(booksData);
        
        if (booksData.length > 0) {
          setSelectedBook(booksData[0].id);
        }
        
        // Then try to get customer purchases
        try {
          const purchasesData = await getCustomerSales();
          console.log("Purchases fetched:", purchasesData);
          setPurchases(purchasesData);
        } catch (purchaseErr) {
          console.error("Error fetching purchases:", purchaseErr);
          setPurchases([]);
          // Don't set error for purchase fetch failure, show empty state instead
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in dashboard:", err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    
    if (!selectedBook || quantity < 1) {
      setMessage({
        type: 'error',
        text: 'Please select a book and quantity'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const saleData = {
        book_id: parseInt(selectedBook),
        quantity: parseInt(quantity)
        // No need to include customer_id, the backend will use it from the token
      };
      
      console.log("Submitting purchase:", saleData);
      await createSale(saleData);
      
      // Refresh purchases
      try {
        const purchasesData = await getCustomerSales();
        setPurchases(purchasesData);
      } catch (err) {
        console.error("Error refreshing purchases:", err);
      }
      
      // Reset form
      setQuantity(1);
      
      setMessage({
        type: 'success',
        text: 'Purchase completed successfully!'
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Purchase error:", err);
      setMessage({
        type: 'error',
        text: err.message || 'Purchase failed. Please try again.'
      });
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && books.length === 0 && purchases.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="customer-dashboard">
      <h2>Welcome, {user.name || user.username}!</h2>
      
      <div className="dashboard-content">
        <div className="purchase-section">
          <h3>Buy a Book</h3>
          
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handlePurchase}>
            <div className="form-group">
              <label htmlFor="book">Select Book:</label>
              <select
                id="book"
                value={selectedBook}
                onChange={e => setSelectedBook(e.target.value)}
                disabled={loading || books.length === 0}
              >
                {books.length === 0 ? (
                  <option value="">No books available</option>
                ) : (
                  books.map(book => (
                    <option key={book.id} value={book.id} disabled={book.stock < 1}>
                      {book.title} - ${formatPrice(book.price)} {book.stock < 1 ? '(Out of stock)' : `(${book.stock} available)`}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                disabled={loading || books.length === 0}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || books.length === 0}
            >
              {loading ? 'Processing...' : 'Purchase'}
            </button>
          </form>
        </div>
        
        <div className="purchases-section">
          <h3>Your Purchase History</h3>
          
          {error && <div className="message error">{error}</div>}
          
          {purchases.length === 0 ? (
            <p>You haven't made any purchases yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td>{formatDate(purchase.sale_date)}</td>
                    <td>{purchase.book_title}</td>
                    <td>{purchase.quantity}</td>
                    <td>${formatPrice(purchase.total_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;