import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const PenjualanList = () => {
    const [penjualans, setPenjualans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPenjualans();
    }, []);

    const fetchPenjualans = async () => {
        try {
            const response = await api.get('/penjualans');
            setPenjualans(response.data);
        } catch (err) {
            setError('Gagal mengambil data penjualan.');
            console.error('Error fetching penjualans:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-8">Loading penjualan...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Daftar Penjualan</h1>

            {penjualans.length === 0 ? (
                <p>Belum ada penjualan yang tercatat.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left">Kode Penjualan</th>
                                <th className="py-3 px-4 text-left">Total Harga</th>
                                <th className="py-3 px-4 text-left">Dibayar</th>
                                <th className="py-3 px-4 text-left">Kembalian</th>
                                <th className="py-3 px-4 text-left">Kasir</th>
                                <th className="py-3 px-4 text-left">Tanggal</th>
                                <th className="py-3 px-4 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penjualans.map((penjualan) => (
                                <tr key={penjualan.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{penjualan.kode_penjualan}</td>
                                    <td className="py-3 px-4">Rp {parseFloat(penjualan.total_harga).toLocaleString('id-ID')}</td>
                                    <td className="py-3 px-4">Rp {parseFloat(penjualan.dibayar).toLocaleString('id-ID')}</td>
                                    <td className="py-3 px-4">Rp {parseFloat(penjualan.kembalian).toLocaleString('id-ID')}</td>
                                    <td className="py-3 px-4">{penjualan.user ? penjualan.user.name : 'N/A'}</td>
                                    <td className="py-3 px-4">{new Date(penjualan.created_at).toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <Link to={`/admin/penjualans/${penjualan.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                                            Detail
                                        </Link>
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

export default PenjualanList;