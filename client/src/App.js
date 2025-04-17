import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import BookList from './components/Books/BookList';
import BookForm from './components/Books/BookForm';
import CustomerList from './components/Customers/CustomerList';
import CustomerForm from './components/Customers/CustomerForm';
import SaleList from './components/Sales/SaleList';
import SaleForm from './components/Sales/SaleForm';
import AuthPage from './components/Auth/AuthPage';
import AdminPanel from './components/Auth/AdminPanel';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser, logoutUser, isAdmin } from './services/authService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('books');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
      setActiveTab('books');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActiveTab('books');
  };

  const toggleAdminPanel = () => {
    setShowAdminPanel(prev => !prev);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not logged in, show the auth page
  if (!user) {
    return (
      <div>
        <AuthPage onLogin={handleLogin} />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={toggleAdminPanel} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
            {showAdminPanel ? 'Hide Admin Panel' : 'Admin Access'}
          </button>
          {showAdminPanel && <AdminPanel />}
        </div>
      </div>
    );
  }

  const adminOptions = user && user.role === 'admin';

  return (
    <div className="app-container">
      <header>
        <div className="header-top">
          <h1>Om Security Services</h1>
          <div className="user-info">
            <span>Welcome, {user.name || user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isAdmin={adminOptions}
        />
      </header>

      <main>
        {/* Books Section - Visible to all but with restricted actions */}
        {activeTab === 'books' && (
          <div className="section">
            <div className="left-panel">
              <BookList 
                onEdit={adminOptions ? handleEdit : null} 
                refreshTrigger={refreshData} 
                onAddNew={adminOptions ? handleAddNew : null}
                isAdmin={adminOptions}
              />
            </div>
            {adminOptions && (
              <div className="right-panel">
                <BookForm 
                  book={selectedBook} 
                  onSave={refreshList} 
                />
              </div>
            )}
          </div>
        )}

        {/* Customer Dashboard - For regular customers */}
        {activeTab === 'dashboard' && !adminOptions && (
          <CustomerDashboard user={user} />
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