<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Barang;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Barang::create([
            'nama_barang' => 'Kopi Kapal Api',
            'deskripsi' => 'Kopi bubuk instan',
            'stok' => 50,
            'stok_minimum' => 10,
            'harga' => 12500.00,
        ]);

        Barang::create([
            'nama_barang' => 'Gula Pasir',
            'deskripsi' => 'Gula pasir kemasan 1kg',
            'stok' => 20,
            'stok_minimum' => 5,
            'harga' => 14000.00,
        ]);

        Barang::create([
            'nama_barang' => 'Indomie Goreng',
            'deskripsi' => 'Mie instan goreng',
            'stok' => 5, // Sengaja stok rendah untuk demo notifikasi
            'stok_minimum' => 5,
            'harga' => 3000.00,
        ]);

        Barang::create([
            'nama_barang' => 'Sabun Mandi Lifebuoy',
            'deskripsi' => 'Sabun batang antiseptik',
            'stok' => 30,
            'stok_minimum' => 7,
            'harga' => 4500.00,
        ]);
    }
}