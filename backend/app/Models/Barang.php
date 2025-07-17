<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_barang',
        'deskripsi',
        'stok',
        'stok_minimum',
        'harga',
    ];

    /**
     * Get the detail penjualans for the barang.
     */
    public function detailPenjualans()
    {
        return $this->hasMany(DetailPenjualan::class);
    }
}