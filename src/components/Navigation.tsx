import React, { useState } from 'react';
import { ChefHat, Camera, FileText, Database, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
    currentPage: 'home' | 'docs' | 'dataset' | 'admin';
    onPageChange: (page: 'home' | 'docs' | 'dataset' | 'admin') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: 'home' as const, label: 'Camera', icon: Camera },
        { id: 'docs' as const, label: 'Documentation', icon: FileText },
        { id: 'dataset' as const, label: 'Dataset', icon: Database },
        { id: 'admin' as const, label: 'Admin', icon: Lock },
    ];

    return (
        <header className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 backdrop-blur sticky-top shadow-sm py-3 transition-all">
            <div className="container">
                {/* Brand */}
                <div className="d-flex align-items-center cursor-pointer" onClick={() => onPageChange('home')}>
                    <div className="p-2 bg-gradient-primary-info rounded-3 shadow-sm me-3">
                        <ChefHat className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="h4 fw-bold text-white mb-0">
                            Padang Food Recognition
                        </h1>
                        <p className="text-white-50 small mb-0 d-none d-sm-block">Advanced AI-powered food identification system</p>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
                </button>

                {/* Collapsible Content */}
                <div className={`collapse navbar-collapse ${isOpen ? 'show mt-3' : ''}`}>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon as any;
                            const isActive = currentPage === item.id;

                            return (
                                <li key={item.id} className="nav-item">
                                    <button
                                        onClick={() => {
                                            onPageChange(item.id);
                                            setIsOpen(false);
                                        }}
                                        className={`
                      nav-link btn btn-link text-start text-decoration-none d-flex align-items-center gap-2 px-3 py-2 rounded-pill transition-all w-100
                      ${isActive ? 'bg-white bg-opacity-10 text-white fw-medium' : 'text-white-50 hover-text-white'}
                    `}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                        <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                            <div className="d-flex justify-content-start">
                                <ThemeToggle />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};
