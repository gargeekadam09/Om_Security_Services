import React, { useState, useEffect } from 'react';
import MainNavigation from './components/MainNavigation';
import HomePage from './components/HomePage';
import FeaturedBooks from './components/FeaturedBooks';
import BookDetailPage from './components/BookDetailPage';
import BookList from './components/Books/BookList';
import BookForm from './components/Books/BookForm';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import SaleList from './components/Sales/SaleList';
import SaleForm from './components/Sales/SaleForm';
import AuthPage from './components/Auth/AuthPage';
import AdminPanel from './components/Auth/AdminPanel';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import { getCurrentUser, logoutUser, isAdmin, isLoggedIn } from './services/authService';
import './App.css';
import './homepage.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewingBookId, setViewingBookId] = useState(null);
  const [refreshData, setRefreshData] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Check localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }
        
        // If not in localStorage, try API
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshList = () => {
    setRefreshData(prev => prev + 1);
  };

  const handleAddNew = () => {
    if (activeTab === 'books') {
      setSelectedBook(null);
    } else if (activeTab === 'customers') {
      setSelectedCustomer(null);
    }
  };

  const handleEdit = (item) => {
    if (activeTab === 'books') {
      setSelectedBook(item);
    } else if (activeTab === 'customers') {
      setSelectedCustomer(item);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'admin') {
      setActiveTab('adminBooks');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActiveTab('home');
  };

  const toggleAdminPanel = () => {
    setShowAdminPanel(prev => !prev);
  };

  const handleViewBook = (bookId) => {
    setViewingBookId(bookId);
    setActiveTab('bookDetail');
  };

  const handleHomeNavigation = (targetTab) => {
    if (targetTab === 'login' || targetTab === 'register') {
      setActiveTab('auth');
      // Set the specific auth tab
      if (targetTab === 'register') {
        // You'll need to update AuthPage to accept a defaultTab prop
        // For now, we'll just navigate to auth
      }
    } else if (targetTab === 'admin') {
      setActiveTab('adminBooks');
    } else {
      setActiveTab(targetTab);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const adminOptions = user && user.role === 'admin';

  return (
    <div className="app-container">
      <MainNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={user ? user.name || user.username : null}
      />

      <main>
        {/* Home Page */}
        {activeTab === 'home' && (
          <>
            <HomePage onNavigate={handleHomeNavigation} />
            <FeaturedBooks onViewBook={handleViewBook} />
          </>
        )}

        {/* Book Detail Page */}
        {activeTab === 'bookDetail' && viewingBookId && (
          <BookDetailPage 
            bookId={viewingBookId} 
            onBack={() => setActiveTab('home')} 
            onLogin={() => setActiveTab('auth')}
          />
        )}

        {/* Authentication Page */}
        {activeTab === 'auth' && !user && (
          <div>
            <AuthPage onLogin={handleLogin} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={toggleAdminPanel} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                {showAdminPanel ? 'Hide Admin Panel' : 'Admin Access'}
              </button>
              {showAdminPanel && <AdminPanel />}
            </div>
          </div>
        )}

        {/* Books Section - Public View */}
        {activeTab === 'books' && (
          <div className="section">
            <div className="full-panel">
              <BookList 
                onViewBook={handleViewBook}
                refreshTrigger={refreshData} 
                isAdmin={false}
              />
            </div>
          </div>
        )}

        {/* Customer Dashboard - For regular customers */}
        {activeTab === 'dashboard' && user && !adminOptions && (
          <CustomerDashboard user={user} />
        )}

        {/* Admin Book Management */}
        {activeTab === 'adminBooks' && adminOptions && (
          <div className="section">
            <div className="left-panel">
              <BookList 
                onEdit={handleEdit} 
                refreshTrigger={refreshData} 
                onAddNew={handleAddNew}
                isAdmin={true}
              />
            </div>
            <div className="right-panel">
              <BookForm 
                book={selectedBook} 
                onSave={refreshList} 
              />
            </div>
          </div>
        )}

        {/* Admin Only Sections */}
        {adminOptions && (
          <>
            {/* Customers Section */}
            {activeTab === 'customers' && (
              <div className="section">
                <div className="left-panel">
                  <CustomerList 
                    onEdit={handleEdit} 
                    refreshTrigger={refreshData} 
                    onAddNew={handleAddNew}
                  />
                </div>
                <div className="right-panel">
                  <CustomerForm 
                    customer={selectedCustomer} 
                    onSave={refreshList} 
                  />
                </div>
              </div>
            )}

            {/* Sales Section */}
            {activeTab === 'sales' && (
              <div className="section">
                <div className="left-panel">
                  <SaleList 
                    refreshTrigger={refreshData} 
                  />
                </div>
                <div className="right-panel">
                  <SaleForm 
                    onSave={refreshList} 
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;