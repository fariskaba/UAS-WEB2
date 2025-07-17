<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Barang;
use App\Models\Penjualan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        if (Gate::denies('access-admin-dashboard')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalBarang = Barang::count();
        $totalPenjualan = Penjualan::count();
        $totalUser = User::count();
        $totalPendapatan = Penjualan::sum('total_harga');
        $barangStokRendah = Barang::whereColumn('stok', '<=', 'stok_minimum')->get();

        return response()->json([
            'total_barang' => $totalBarang,
            'total_penjualan' => $totalPenjualan,
            'total_user' => $totalUser,
            'total_pendapatan' => $totalPendapatan,
            'barang_stok_rendah' => $barangStokRendah,
        ]);
    }

    public function kasirDashboard()
    {
        if (Gate::denies('access-kasir-dashboard')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalPenjualanHariIni = Penjualan::whereDate('created_at', today())->count();
        $pendapatanHariIni = Penjualan::whereDate('created_at', today())->sum('total_harga');

        return response()->json([
            'total_penjualan_hari_ini' => $totalPenjualanHariIni,
            'pendapatan_hari_ini' => $pendapatanHariIni,
        ]);
    }
}