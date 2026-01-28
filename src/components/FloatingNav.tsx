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
      <button
        onClick={toggleNav}
        className="btn btn-danger position-fixed top-0 end-0 m-3 z-3 d-lg-none shadow-sm"
        style={{ borderRadius: '12px' }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-2 d-lg-none"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`
        position-fixed z-3 transition-all
        ${isOpen ? 'top-0 end-0 m-3 mt-5 pt-4' : 'd-none d-lg-block top-50 end-0 translate-middle-y me-4'}
      `}>
        <div className="bg-dark bg-opacity-75 backdrop-blur rounded-4 shadow-lg p-2 border border-secondary">
          <div className="d-flex flex-column gap-2">
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
                    btn d-flex align-items-center gap-2 px-4 py-3 rounded-pill transition-all border-0
                    ${isActive
                      ? 'btn-danger text-white shadow'
                      : 'btn-outline-light text-light hover-opacity'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-secondary'} />
                  <span className={`fw-medium ${isActive ? 'text-white' : 'text-light'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};