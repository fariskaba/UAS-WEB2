import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Notification from '../../components/Notification';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard/admin');
                setDashboardData(response.data);

                // Mengelola notifikasi untuk setiap barang stok rendah
                if (response.data.barang_stok_rendah && response.data.barang_stok_rendah.length > 0) {
                    const newNotifications = response.data.barang_stok_rendah.map((item, index) => {
                        let message = '';
                        let type = 'warning';

                        if (item.stok === 0) {
                            message = `Stok ${item.nama_barang} habis!`;
                            type = 'error';
                        } else {
                            message = `Stok ${item.nama_barang} hampir habis! (Stok: ${item.stok}, Min: ${item.stok_minimum})`;
                        }

                        return {
                            id: item.id,
                            message: message,
                            type: type
                        };
                    });
                    setNotifications(newNotifications);
                } else {
                    setNotifications([]);
                }

            } catch (err) {
                setError('Gagal mengambil data dashboard.');
                console.error('Error fetching admin dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();

        // Opsional: Refresh data secara berkala untuk notifikasi real-time
        // const intervalId = setInterval(fetchDashboardData, 60000); // Setiap 1 menit
        // return () => clearInterval(intervalId);

    }, []);

    const handleCloseNotification = (id) => {
        setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== id));
    };

    if (loading) return <div className="text-center mt-8">Loading dashboard...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!dashboardData) return <div className="text-center mt-8">No dashboard data available.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

            {/* Menampilkan setiap notifikasi */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
                {notifications.map(notif => (
                    <Notification
                        key={notif.id}
                        message={notif.message}
                        type={notif.type}
                        onClose={() => handleCloseNotification(notif.id)}
                    />
                ))}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Barang</h3>
                    <p className="text-4xl font-bold text-blue-600">{dashboardData.total_barang}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Penjualan</h3>
                    <p className="text-4xl font-bold text-green-600">{dashboardData.total_penjualan}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total User</h3>
                    <p className="text-4xl font-bold text-purple-600">{dashboardData.total_user}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-600">Total Pendapatan</h3>
                    <p className="text-4xl font-bold text-yellow-600">Rp {parseFloat(dashboardData.total_pendapatan).toLocaleString('id-ID')}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Barang Stok Rendah</h2>
                {dashboardData.barang_stok_rendah && dashboardData.barang_stok_rendah.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {dashboardData.barang_stok_rendah.map((barang) => (
                            <li key={barang.id} className="mb-2 text-red-600">
                                {barang.nama_barang} (Stok: {barang.stok}, Min: {barang.stok_minimum})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Tidak ada barang dengan stok rendah.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;