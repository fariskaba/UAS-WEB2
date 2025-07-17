import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-2xl mb-4">Halaman tidak ditemukan!</p>
            <Link to="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
        </div>
    );
};

export default NotFound;