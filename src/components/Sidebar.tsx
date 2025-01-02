import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useLogoStore } from '../store/logoStore';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Pin,
  Calculator,
  Wrench,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: Calendar, label: 'Schedule' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/requests', icon: FileText, label: 'Requests' },
  { to: '/quotes', icon: Calculator, label: 'Quotes' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/communications', icon: MessageSquare, label: 'Communications' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { logo, collapsedLogo, showText } = useLogoStore();

  const showExpanded = isPinned || isHovered;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <aside
      className={`
        bg-primary text-white min-h-screen relative transition-all duration-300 ease-in-out
        ${showExpanded ? 'w-64' : 'w-16'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`absolute right-0 top-4 z-10 transition-opacity duration-300 ${
          showExpanded ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={() => setIsPinned(!isPinned)}
          className={`bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark 
                     transition-all duration-300 ease-in-out active:scale-90
                     ${isPinned ? 'rotate-45' : ''}`}
        >
          <Pin className="w-4 h-4" />
        </button>
        {showTooltip && showExpanded && (
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {isPinned ? 'Unpin menu' : 'Pin menu'}
          </div>
        )}
      </div>

      <div className={`flex items-center justify-center py-6 px-4 transition-all duration-300 ${
        showExpanded ? 'h-20' : 'h-16'
      }`}>
        <div className="flex items-center gap-2">
          {logo ? (
            <img 
              src={showExpanded ? logo : (collapsedLogo || logo)} 
              alt="True Blue Handyman"
              className={`transition-all duration-300 ${
                showExpanded ? 'w-48 px-2' : 'w-10 px-1'
              } h-auto object-contain`}
            />
          ) : (
            <Wrench className={`transition-all duration-300 ${
              showExpanded ? 'w-10 h-10' : 'w-8 h-8'
            } text-white`} />
          )}
          {showExpanded && showText && (
            <span className="text-sm font-bold text-white text-center whitespace-nowrap mt-1">
              True Blue Handyman
            </span>
          )}
        </div>
      </div>
      
      <nav className="space-y-1 px-2">
        {navItems.map(({ to, icon: Icon, label }, index) => (
          <React.Fragment key={to}>
            {index === 3 && <div className="my-2 border-t border-primary-dark/30" />}
            {index === navItems.length - 2 && <div className="my-2 border-t border-primary-dark/30" />}
            <NavLink
              to={to}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg 
                transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-dark text-white'
                  : 'text-blue-100 hover:bg-primary-dark hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {showExpanded && (
                <span className="transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                  {label}
                </span>
              )}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;