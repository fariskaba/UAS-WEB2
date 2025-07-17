import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const BarangList = () => {
    const [barangs, setBarangs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBarangs();
    }, []);

    const fetchBarangs = async () => {
        try {
            const response = await api.get('/barangs');
            setBarangs(response.data);
        } catch (err) {
            setError('Gagal mengambil data barang.');
            console.error('Error fetching barangs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            try {
                await api.delete(`/barangs/${id}`);
                setBarangs(barangs.filter((barang) => barang.id !== id));
                alert('Barang berhasil dihapus!');
            } catch (err) {
                setError('Gagal menghapus barang.');
                console.error('Error deleting barang:', err);
            }
        }
    };

    if (loading) return <div className="text-center mt-8">Loading barang...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Daftar Barang</h1>
            <Link to="/admin/barangs/create" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
                Tambah Barang Baru
            </Link>

            {barangs.length === 0 ? (
                <p>Tidak ada barang yang tersedia.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left">ID</th>
                                <th className="py-3 px-4 text-left">Nama Barang</th>
                                <th className="py-3 px-4 text-left">Stok</th>
                                <th className="py-3 px-4 text-left">Stok Minimum</th>
                                <th className="py-3 px-4 text-left">Harga</th>
                                <th className="py-3 px-4 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {barangs.map((barang) => (
                                <tr key={barang.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{barang.id}</td>
                                    <td className="py-3 px-4">{barang.nama_barang}</td>
                                    <td className="py-3 px-4">{barang.stok}</td>
                                    <td className="py-3 px-4">{barang.stok_minimum}</td>
                                    <td className="py-3 px-4">Rp {parseFloat(barang.harga).toLocaleString('id-ID')}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link to={`/admin/barangs/edit/${barang.id}`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(barang.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BarangList;