import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="d-flex bg-dark bg-opacity-50 backdrop-blur rounded-pill p-1 border border-secondary border-opacity-50">
            <button
                onClick={() => setTheme('light')}
                className={`btn btn-sm btn-icon rounded-circle d-flex align-items-center justify-content-center p-2 border-0 ${theme === 'light' ? 'bg-white text-dark shadow-sm' : 'text-white-50 hover-text-white'}`}
                title="Light Mode"
            >
                <Sun size={14} />
            </button>
            <button
                onClick={() => setTheme('auto')}
                className={`btn btn-sm btn-icon rounded-circle d-flex align-items-center justify-content-center p-2 border-0 ${theme === 'auto' ? 'bg-white text-dark shadow-sm' : 'text-white-50 hover-text-white'}`}
                title="System Auto"
            >
                <Monitor size={14} />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`btn btn-sm btn-icon rounded-circle d-flex align-items-center justify-content-center p-2 border-0 ${theme === 'dark' ? 'bg-white text-dark shadow-sm' : 'text-white-50 hover-text-white'}`}
                title="Dark Mode"
            >
                <Moon size={14} />
            </button>
        </div>
    );
};
