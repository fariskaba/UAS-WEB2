<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'kode_penjualan',
        'total_harga',
        'dibayar',
        'kembalian',
    ];

    /**
     * Get the user (kasir) that owns the penjualan.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the detail penjualans for the penjualan.
     */
    public function detailPenjualans()
    {
        return $this->hasMany(DetailPenjualan::class);
    }
}