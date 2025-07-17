import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);

            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/kasir/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Silakan periksa kredensial Anda.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4 font-inter">
            <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Left Section - Gray Gradient */}
                <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 text-white
                            bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 relative overflow-hidden">
                    {/* Abstract shapes for background */}
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-white opacity-10 rounded-full rotate-45 transform skew-y-12"></div>
                    <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-white opacity-10 rounded-full -rotate-45 transform skew-y-12"></div>
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full rotate-12"></div>

                    <div className="z-10 text-center">
                        <h2 className="text-4xl font-bold mb-2">LOGIN</h2>
                        <p className="text-lg">Selamat datang kembali di Toko Pak Met!</p>
                        <p className="mt-4 text-sm">
                            Masuk untuk mengelola inventori dan penjualan Anda.
                        </p>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        {/* Logo from image, colors changed to match new theme */}
                        <div className="mx-auto w-28 h-28 mb-4 flex items-center justify-center">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M50 0L75 25L50 50L25 25L50 0Z" fill="#A0AEC0"/>
                                <path d="M50 50L75 75L50 100L25 75L50 50Z" fill="#718096"/>
                                <path d="M75 25L100 50L75 75L50 50L75 25Z" fill="#A0AEC0"/>
                                <path d="M0 50L25 25L50 50L25 75L0 50Z" fill="#718096"/>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">LOGIN</h2>
                    </div>

                    {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    className="pl-10 shadow-sm appearance-none border-b-2 border-gray-300 rounded-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-500" /* Warna fokus diubah */
                                    id="email"
                                    type="email"
                                    placeholder="admin@tokopakmet.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    className="pl-10 pr-12 shadow-sm appearance-none border-b-2 border-gray-300 rounded-none w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:border-gray-500" /* Warna fokus diubah, pr-12 untuk ikon mata */
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center bg-transparent border-none p-0 cursor-pointer" // Menggeser ikon mata ke kiri (right-3)
                                    style={{ padding: '0', background: 'none' }}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mb-6">
                            <button
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
                                type="submit"
                            >
                                LOGIN
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-8 text-sm">
                        <p className="text-gray-600">
                            Belum punya akun?{' '}
                            <Link to="/register" className="font-bold text-gray-600 hover:text-gray-800">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
