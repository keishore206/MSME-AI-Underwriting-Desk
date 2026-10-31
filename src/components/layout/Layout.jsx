import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      <Sidebar />
      <TopBar />
      <main style={{
        marginLeft: '240px',
        marginTop: '64px',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#F8FAFC',
        padding: '24px',
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
