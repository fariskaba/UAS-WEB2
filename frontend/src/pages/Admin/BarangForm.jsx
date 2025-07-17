import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Notification from '../../components/Notification'; // Pastikan ini diimpor

const BarangForm = () => {
    const [namaBarang, setNamaBarang] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [stok, setStok] = useState('');
    const [stokMinimum, setStokMinimum] = useState('');
    const [harga, setHarga] = useState('');
    const [error, setError] = useState(''); // Keep this for form-specific errors
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]); // State untuk notifikasi pop-up
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL for editing

    useEffect(() => {
        if (id) {
            fetchBarang();
        }
    }, [id]);

    const fetchBarang = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/barangs/${id}`);
            const data = response.data;
            setNamaBarang(data.nama_barang);
            setDeskripsi(data.deskripsi || '');
            setStok(data.stok);
            setStokMinimum(data.stok_minimum);
            setHarga(data.harga);
        } catch (err) {
            setError('Gagal mengambil data barang untuk diedit.');
            addNotification('Gagal mengambil data barang untuk diedit.', 'error');
            console.error('Error fetching barang for edit:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk menambahkan notifikasi
    const addNotification = (message, type) => {
        const newNotif = {
            id: Date.now(), // Unique ID for the notification
            message,
            type
        };
        setNotifications(prevNotifications => [...prevNotifications, newNotif]);
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== newNotif.id));
        }, 5000);
    };

    // Fungsi untuk menutup notifikasi secara manual
    const handleCloseNotification = (notifId) => {
        setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== notifId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const barangData = {
            nama_barang: namaBarang,
            deskripsi,
            stok: parseInt(stok),
            stok_minimum: parseInt(stokMinimum),
            harga: parseFloat(harga),
        };

        try {
            if (id) {
                // Update existing barang
                await api.put(`/barangs/${id}`, barangData);
                addNotification('Barang berhasil diperbarui!', 'success');
            } else {
                // Create new barang
                await api.post('/barangs', barangData);
                addNotification('Barang berhasil ditambahkan!', 'success');
            }
            // Menunda navigasi agar notifikasi sempat terlihat
            setTimeout(() => {
                navigate('/admin/barangs');
            }, 1500); // Navigasi setelah 1.5 detik
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Gagal menyimpan barang. Periksa input Anda.';
            setError(errorMessage);
            addNotification(errorMessage, 'error');
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                let errorMessages = '';
                for (const key in errors) {
                    errorMessages += errors[key].join(', ') + '\n';
                }
                setError(errorMessages); // Still show detailed errors in form if needed
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) return <div className="text-center mt-8">Loading data barang...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Barang' : 'Tambah Barang Baru'}</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Menampilkan setiap notifikasi di pojok kanan bawah */}
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

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama_barang">
                        Nama Barang
                    </label>
                    <input
                        type="text"
                        id="nama_barang"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={namaBarang}
                        onChange={(e) => setNamaBarang(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deskripsi">
                        Deskripsi
                    </label>
                    <textarea
                        id="deskripsi"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stok">
                        Stok
                    </label>
                    <input
                        type="number"
                        id="stok"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={stok}
                        onChange={(e) => setStok(e.target.value)}
                        required
                        min="0"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stok_minimum">
                        Stok Minimum (untuk notifikasi)
                    </label>
                    <input
                        type="number"
                        id="stok_minimum"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={stokMinimum}
                        onChange={(e) => setStokMinimum(e.target.value)}
                        required
                        min="0"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="harga">
                        Harga
                    </label>
                    <input
                        type="number"
                        id="harga"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        required
                        step="0.01"
                        min="0"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : (id ? 'Update Barang' : 'Tambah Barang')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/barangs')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BarangForm;
