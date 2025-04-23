import React from 'react';

const Navigation = ({ activeTab, setActiveTab, isAdmin }) => {
  return (
    <div className="nav-tabs">
      <div 
        className={`nav-tab ${activeTab === 'service' ? 'active' : ''}`}
        onClick={() => setActiveTab('service')}
      >
        Services
      </div>
      
      {isAdmin ? (
        <>
          <div 
            className={`nav-tab ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </div>
          <div 
            className={`nav-tab ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </div>
        </>
      ) : (
        <div 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          My Dashboard
        </div>
      )}
    </div>
  );
};

export default Navigation;