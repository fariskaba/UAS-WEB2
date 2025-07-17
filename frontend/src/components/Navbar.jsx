import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Gagal logout. Coba lagi.');
        }
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Toko Pak Met</Link>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span>Halo, {user.name} ({user.role})</span>
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard Admin</Link>
                                    <Link to="/admin/barangs" className="hover:text-gray-300">Barang</Link>
                                    <Link to="/admin/penjualans" className="hover:text-gray-300">Penjualan</Link>
                                </>
                            )}
                            {user.role === 'kasir' && (
                                <>
                                    <Link to="/kasir/dashboard" className="hover:text-gray-300">Dashboard Kasir</Link>
                                    <Link to="/kasir/pos" className="hover:text-gray-300">Kasir</Link>
                                </>
                            )}
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;