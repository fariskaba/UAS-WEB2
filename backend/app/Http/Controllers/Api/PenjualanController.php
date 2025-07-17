<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penjualan;
use App\Models\DetailPenjualan;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class PenjualanController extends Controller
{
    public function index()
    {
        if (Gate::denies('view-penjualan')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $penjualans = Penjualan::with('user', 'detailPenjualans.barang')->orderBy('created_at', 'desc')->get();
        return response()->json($penjualans);
    }

    public function show(Penjualan $penjualan)
    {
        if (Gate::denies('view-penjualan')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $penjualan->load('user', 'detailPenjualans.barang');
        return response()->json($penjualan);
    }

    public function store(Request $request)
    {
        if (Gate::denies('make-penjualan')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'items' => 'required|array',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
            'dibayar' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $totalHarga = 0;
            $detailPenjualansData = [];

            foreach ($request->items as $item) {
                $barang = Barang::find($item['barang_id']);
                if (!$barang) {
                    throw new \Exception("Barang dengan ID {$item['barang_id']} tidak ditemukan.");
                }
                if ($barang->stok < $item['jumlah']) {
                    throw new \Exception("Stok {$barang->nama_barang} tidak cukup. Stok tersedia: {$barang->stok}");
                }

                $subTotal = $barang->harga * $item['jumlah'];
                $totalHarga += $subTotal;

                $detailPenjualansData[] = [
                    'barang_id' => $barang->id,
                    'jumlah' => $item['jumlah'],
                    'harga_satuan' => $barang->harga,
                    'sub_total' => $subTotal,
                ];

                // Kurangi stok barang
                $barang->decrement('stok', $item['jumlah']);
            }

            $kembalian = $request->dibayar - $totalHarga;
            if ($kembalian < 0) {
                throw new \Exception("Pembayaran kurang. Total yang harus dibayar: {$totalHarga}");
            }

            $penjualan = Penjualan::create([
                'user_id' => $request->user()->id, // Kasir yang sedang login
                'kode_penjualan' => 'TRX-' . time() . '-' . uniqid(),
                'total_harga' => $totalHarga,
                'dibayar' => $request->dibayar,
                'kembalian' => $kembalian,
            ]);

            foreach ($detailPenjualansData as $detail) {
                $penjualan->detailPenjualans()->create($detail);
            }

            DB::commit();

            return response()->json([
                'message' => 'Penjualan berhasil',
                'penjualan' => $penjualan->load('detailPenjualans.barang')
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}