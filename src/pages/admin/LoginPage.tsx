import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '../../components/admin/AdminLogin';

export const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        // Redirect to dashboard on successful login
        navigate('/admin/dashboard');
    };

    return <AdminLogin onLogin={handleLoginSuccess} />;
};
