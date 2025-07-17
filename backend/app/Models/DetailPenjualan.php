<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailPenjualan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'penjualan_id',
        'barang_id',
        'jumlah',
        'harga_satuan',
        'sub_total',
    ];

    /**
     * Get the penjualan that owns the detail penjualan.
     */
    public function penjualan()
    {
        return $this->belongsTo(Penjualan::class);
    }

    /**
     * Get the barang that owns the detail penjualan.
     */
    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}