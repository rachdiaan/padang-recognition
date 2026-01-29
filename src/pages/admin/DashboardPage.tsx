import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../../components/admin/AdminDashboard';

export const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();

    // Check for auth token on load
    React.useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    return <AdminDashboard onLogout={handleLogout} />;
};
