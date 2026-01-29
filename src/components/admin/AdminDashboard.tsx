import React from 'react';
import { LogOut, BarChart2, Users, Settings } from 'lucide-react';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h2 className="fw-bold mb-1">Admin Dashboard</h2>
                    <p className="text-secondary mb-0">Manage your application settings and content</p>
                </div>
                <button onClick={onLogout} className="btn btn-outline-danger d-flex align-items-center gap-2">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 bg-primary bg-opacity-10 rounded-circle text-primary">
                                    <BarChart2 size={24} />
                                </div>
                                <h5 className="fw-bold mb-0">Statistics</h5>
                            </div>
                            <p className="text-secondary small">View model usage and classification stats.</p>
                            <button className="btn btn-sm btn-link text-decoration-none p-0">View Reports &rarr;</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 bg-success bg-opacity-10 rounded-circle text-success">
                                    <Users size={24} />
                                </div>
                                <h5 className="fw-bold mb-0">User Management</h5>
                            </div>
                            <p className="text-secondary small">Manage admin accounts and permissions.</p>
                            <button className="btn btn-sm btn-link text-decoration-none p-0">Manage Users &rarr;</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 bg-warning bg-opacity-10 rounded-circle text-warning">
                                    <Settings size={24} />
                                </div>
                                <h5 className="fw-bold mb-0">System Settings</h5>
                            </div>
                            <p className="text-secondary small">Configure model parameters and API keys.</p>
                            <button className="btn btn-sm btn-link text-decoration-none p-0">Configure &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div className="alert alert-info border-0 shadow-sm d-flex align-items-center" role="alert">
                    <div className="me-3">ℹ️</div>
                    <div>
                        <strong>System Status:</strong> The backend is active and the computer vision model (v2.0.0-optimized) is loaded.
                    </div>
                </div>
            </div>
        </div>
    );
};
