import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-icon rounded-circle d-flex align-items-center justify-content-center p-2 border-0 bg-dark bg-opacity-25 backdrop-blur text-white hover-opacity transition-all"
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{ width: '40px', height: '40px' }}
        >
            {resolvedTheme === 'dark' ? (
                <Sun size={20} className="text-warning" />
            ) : (
                <Moon size={20} className="text-white" />
            )}
        </button>
    );
};
