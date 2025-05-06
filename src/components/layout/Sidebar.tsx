
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ChartBar, 
  ChartPie, 
  LayoutDashboard 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'News',
      path: '/news',
      icon: <ChartBar size={20} />,
    },
    {
      name: 'Payouts',
      path: '/payouts',
      icon: <ChartPie size={20} />,
    }
  ];
  
  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-all duration-300 z-10",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md group transition-colors",
                location.pathname === item.path
                  ? "bg-brand-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
