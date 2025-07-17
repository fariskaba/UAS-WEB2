import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Notification from '../../components/Notification';

const KasirPointOfSale = () => {
    const [barangs, setBarangs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [keranjang, setKeranjang] = useState([]);
    const [dibayar, setDibayar] = useState('');
    const [kembalian, setKembalian] = useState(0);
    const [totalHarga, setTotalHarga] = useState(0);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchBarangs();
    }, []);

    useEffect(() => {
        const calculatedTotal = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
        setTotalHarga(calculatedTotal);
        setKembalian(dibayar - calculatedTotal);
    }, [keranjang, dibayar]);

    const fetchBarangs = async () => {
        try {
            const response = await api.get('/barangs');
            setBarangs(response.data);
        } catch (err) {
            setError('Gagal mengambil data barang.');
            console.error('Error fetching barangs:', err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const addToKeranjang = (barang) => {
        const existingItem = keranjang.find(item => item.id === barang.id);
        if (existingItem) {
            // Check if adding one more exceeds stock
            if (existingItem.jumlah + 1 > barang.stok) {
                addNotification(`Stok ${barang.nama_barang} tidak cukup!`, 'error');
                return;
            }
            setKeranjang(keranjang.map(item =>
                item.id === barang.id ? { ...item, jumlah: item.jumlah + 1 } : item
            ));
        } else {
            if (barang.stok === 0) {
                addNotification(`${barang.nama_barang} stok habis!`, 'error');
                return;
            }
            setKeranjang([...keranjang, { ...barang, jumlah: 1 }]);
        }
        // Clear any previous notification related to stock if item is added successfully
        setNotifications(prevNotifications => prevNotifications.filter(notif => notif.type !== 'error' || !notif.message.includes(barang.nama_barang)));
    };

    const updateJumlah = (id, newJumlah) => {
        setKeranjang(keranjang.map(item => {
            if (item.id === id) {
                if (newJumlah < 1) {
                    return null; // Akan dihapus
                }
                // Check against original barang stok
                const originalBarang = barangs.find(b => b.id === id);
                if (originalBarang && newJumlah > originalBarang.stok) {
                    addNotification(`Stok ${item.nama_barang} tidak cukup!`, 'error');
                    return item; // Keep current quantity
                }
                // Clear any previous notification related to stock if quantity is valid
                setNotifications(prevNotifications => prevNotifications.filter(notif => notif.type !== 'error' || !notif.message.includes(item.nama_barang)));
                return { ...item, jumlah: newJumlah };
            }
            return item;
        }).filter(Boolean)); // Remove nulls (items with jumlah < 1)
    };

    const removeFromKeranjang = (id) => {
        setKeranjang(keranjang.filter(item => item.id !== id));
    };

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

    const handleCloseNotification = (id) => {
        setNotifications(prevNotifications => prevNotifications.filter(notif => notif.id !== id));
    };

    const handleBayar = async () => {
        if (keranjang.length === 0) {
            addNotification('Keranjang kosong. Tambahkan barang terlebih dahulu.', 'error');
            return;
        }
        if (dibayar < totalHarga) {
            addNotification('Jumlah pembayaran kurang dari total harga.', 'error');
            return;
        }

        setError(null); // Clear previous API errors
        try {
            const itemsToSell = keranjang.map(item => ({
                barang_id: item.id,
                jumlah: item.jumlah,
            }));

            const response = await api.post('/penjualan', {
                items: itemsToSell,
                dibayar: parseFloat(dibayar),
            });
            addNotification(`Penjualan berhasil! Kembalian: Rp ${parseFloat(response.data.penjualan.kembalian).toLocaleString('id-ID')}`, 'success');
            setKeranjang([]);
            setDibayar('');
            setKembalian(0);
            setTotalHarga(0);
            fetchBarangs(); // Refresh stock data
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat memproses penjualan.';
            addNotification(errorMessage, 'error');
            console.error('Error during sale:', err);
        }
    };

    const filteredBarangs = barangs.filter(barang =>
        barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
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

            <div className="md:w-2/3 bg-white p-6 rounded-lg shadow-md h-full overflow-y-auto">
                <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Cari barang..."
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBarangs.length === 0 ? (
                        <p className="col-span-full text-center">Tidak ada barang ditemukan.</p>
                    ) : (
                        filteredBarangs.map((barang) => (
                            <div key={barang.id} className="border p-4 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-lg">{barang.nama_barang}</h3>
                                <p className="text-gray-600">Stok: {barang.stok}</p>
                                <p className="font-bold text-xl text-green-600">Rp {parseFloat(barang.harga).toLocaleString('id-ID')}</p>
                                <button
                                    onClick={() => addToKeranjang(barang)}
                                    className={`mt-2 px-4 py-2 rounded text-white ${barang.stok === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    disabled={barang.stok === 0}
                                >
                                    Tambah ke Keranjang
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md h-full">
                <h2 className="text-2xl font-bold mb-4">Keranjang Belanja</h2>
                {keranjang.length === 0 ? (
                    <p>Keranjang kosong.</p>
                ) : (
                    <ul className="mb-4">
                        {keranjang.map((item) => (
                            <li key={item.id} className="flex justify-between items-center py-2 border-b">
                                <div>
                                    <p className="font-semibold">{item.nama_barang}</p>
                                    <p className="text-sm text-gray-600">Rp {parseFloat(item.harga).toLocaleString('id-ID')} x {item.jumlah}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateJumlah(item.id, item.jumlah - 1)}
                                        className="bg-red-400 text-white px-2 py-1 rounded"
                                    >-</button>
                                    <span>{item.jumlah}</span>
                                    <button
                                        onClick={() => updateJumlah(item.id, item.jumlah + 1)}
                                        className="bg-green-400 text-white px-2 py-1 rounded"
                                    >+</button>
                                    <button
                                        onClick={() => removeFromKeranjang(item.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-4 border-t pt-4">
                    <p className="text-xl font-bold mb-2">Total: Rp {totalHarga.toLocaleString('id-ID')}</p>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dibayar">
                            Jumlah Dibayar
                        </label>
                        <input
                            type="number"
                            id="dibayar"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={dibayar}
                            onChange={(e) => setDibayar(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <p className="text-xl font-bold text-blue-600 mb-4">Kembalian: Rp {kembalian.toLocaleString('id-ID')}</p>
                    <button
                        onClick={handleBayar}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg text-lg"
                        disabled={keranjang.length === 0 || dibayar < totalHarga}
                    >
                        Proses Pembayaran
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KasirPointOfSale;