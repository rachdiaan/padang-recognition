import React, { useState } from 'react';
import { Camera, FileText, Database, Menu, X } from 'lucide-react';

interface FloatingNavProps {
  currentPage: 'home' | 'docs' | 'dataset';
  onPageChange: (page: 'home' | 'docs' | 'dataset') => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Camera', icon: Camera },
    { id: 'docs' as const, label: 'Documentation', icon: FileText },
    { id: 'dataset' as const, label: 'Dataset', icon: Database },
  ];

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleNav}
        className="fixed top-6 right-6 z-50 lg:hidden bg-gradient-to-br from-orange-500 to-red-500 text-white p-3 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav className={`
        fixed z-50 transition-all duration-300 ease-in-out
        lg:top-1/2 lg:right-8 lg:transform lg:-translate-y-1/2
        ${isOpen 
          ? 'top-24 right-6 opacity-100 translate-x-0' 
          : 'top-24 right-6 opacity-0 translate-x-full lg:opacity-100 lg:translate-x-0'
        }
      `}>
        <div className="bg-black/20 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-2">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`
                    group relative flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-400'} />
                  <span className={`font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-20 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};