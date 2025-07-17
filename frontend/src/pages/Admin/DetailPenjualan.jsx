import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const DetailPenjualan = () => {
    const { id } = useParams();
    const [penjualan, setPenjualan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDetailPenjualan();
    }, [id]);

    const fetchDetailPenjualan = async () => {
        try {
            const response = await api.get(`/penjualans/${id}`);
            setPenjualan(response.data);
        } catch (err) {
            setError('Gagal mengambil detail penjualan.');
            console.error('Error fetching detail penjualan:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-8">Loading detail penjualan...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!penjualan) return <div className="text-center mt-8">Detail penjualan tidak ditemukan.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Detail Penjualan: {penjualan.kode_penjualan}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4">Informasi Umum</h2>
                <p className="mb-2"><strong>Kasir:</strong> {penjualan.user ? penjualan.user.name : 'N/A'}</p>
                <p className="mb-2"><strong>Tanggal Penjualan:</strong> {new Date(penjualan.created_at).toLocaleString()}</p>
                <p className="mb-2"><strong>Total Harga:</strong> Rp {parseFloat(penjualan.total_harga).toLocaleString('id-ID')}</p>
                <p className="mb-2"><strong>Dibayar:</strong> Rp {parseFloat(penjualan.dibayar).toLocaleString('id-ID')}</p>
                <p className="mb-2"><strong>Kembalian:</strong> Rp {parseFloat(penjualan.kembalian).toLocaleString('id-ID')}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Detail Barang</h2>
                {penjualan.detail_penjualans && penjualan.detail_penjualans.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 text-left">Barang</th>
                                    <th className="py-2 px-4 text-left">Jumlah</th>
                                    <th className="py-2 px-4 text-left">Harga Satuan</th>
                                    <th className="py-2 px-4 text-left">Sub Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {penjualan.detail_penjualans.map((detail) => (
                                    <tr key={detail.id} className="border-b">
                                        <td className="py-2 px-4">{detail.barang ? detail.barang.nama_barang : 'N/A'}</td>
                                        <td className="py-2 px-4">{detail.jumlah}</td>
                                        <td className="py-2 px-4">Rp {parseFloat(detail.harga_satuan).toLocaleString('id-ID')}</td>
                                        <td className="py-2 px-4">Rp {parseFloat(detail.sub_total).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Tidak ada detail barang untuk penjualan ini.</p>
                )}
            </div>

            <div className="mt-6">
                <Link to="/admin/penjualans" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                    Kembali ke Daftar Penjualan
                </Link>
            </div>
        </div>
    );
};

export default DetailPenjualan;