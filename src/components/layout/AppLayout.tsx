
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Navigate, Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-screen pt-16">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
