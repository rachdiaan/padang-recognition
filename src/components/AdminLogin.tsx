import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

export const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Welcome, ${data.username}! Token: ${data.token.substring(0, 10)}... (Check console)`);
                console.log('Login Success:', data);
                // Save token to localStorage here
                localStorage.setItem('adminToken', data.token);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card card-premium shadow-lg overflow-hidden">
                        <div className="card-header bg-dark text-white p-4 text-center">
                            <h3 className="fw-bold mb-0">Admin Login</h3>
                            <p className="text-secondary small mb-0">Restricted Access</p>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                    <Lock className="me-2" size={18} />
                                    <div>{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label className="form-label text-secondary fw-semibold small">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><User size={20} className="text-secondary" /></span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 py-2"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-secondary fw-semibold small">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><Lock size={20} className="text-secondary" /></span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-0 py-2"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm transition-all hover-shadow"
                                    disabled={loading}
                                >
                                    {loading ? 'Authenticating...' : 'Login to Dashboard'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
