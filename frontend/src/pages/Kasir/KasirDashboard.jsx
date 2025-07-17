import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const KasirDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/kasir');
                setDashboardData(response.data);
            } catch (err) {
                setError('Gagal mengambil data dashboard kasir.');
                console.error('Error fetching kasir dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading dashboard...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!dashboardData) return <div className="text-center mt-8">No dashboard data available.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard Kasir</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Penjualan Hari Ini</h3>
                    <p className="text-4xl font-bold text-blue-600">{dashboardData.total_penjualan_hari_ini}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Pendapatan Hari Ini</h3>
                    <p className="text-4xl font-bold text-green-600">Rp {parseFloat(dashboardData.pendapatan_hari_ini).toLocaleString('id-ID')}</p>
                </div>
            </div>
            {/* Anda bisa menambahkan grafik atau informasi lain yang relevan untuk kasir di sini */}
        </div>
    );
};

export default KasirDashboard;