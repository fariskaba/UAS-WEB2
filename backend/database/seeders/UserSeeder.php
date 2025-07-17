<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin Toko Pak Met',
            'email' => 'admin@tokopakmet.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Kasir Toko Pak Met',
            'email' => 'kasir@tokopakmet.com',
            'password' => Hash::make('kasir123'),
            'role' => 'kasir',
        ]);
    }
}