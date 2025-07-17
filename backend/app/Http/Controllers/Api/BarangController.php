<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class BarangController extends Controller
{
    public function index()
    {
        if (Gate::denies('view-barang')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $barangs = Barang::all();
        return response()->json($barangs);
    }

    public function show(Barang $barang)
    {
        if (Gate::denies('view-barang')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($barang);
    }

    public function store(Request $request)
    {
        if (Gate::denies('manage-barang')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nama_barang' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'stok' => 'required|integer|min:0',
            'stok_minimum' => 'required|integer|min:0',
            'harga' => 'required|numeric|min:0',
        ]);

        $barang = Barang::create($request->all());
        return response()->json($barang, 201);
    }

    public function update(Request $request, Barang $barang)
    {
        if (Gate::denies('manage-barang')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nama_barang' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'stok' => 'sometimes|required|integer|min:0',
            'stok_minimum' => 'sometimes|required|integer|min:0',
            'harga' => 'sometimes|required|numeric|min:0',
        ]);

        $barang->update($request->all());
        return response()->json($barang);
    }

    public function destroy(Barang $barang)
    {
        if (Gate::denies('manage-barang')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $barang->delete();
        return response()->json(['message' => 'Barang deleted successfully']);
    }

    public function lowStock()
    {
        if (Gate::denies('view-barang')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $lowStockBarangs = Barang::whereColumn('stok', '<=', 'stok_minimum')->get();
        return response()->json($lowStockBarangs);
    }
}