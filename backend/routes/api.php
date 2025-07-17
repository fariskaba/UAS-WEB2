<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\PenjualanController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Barang routes (Admin only for manage, Admin/Kasir for view)
    Route::apiResource('barangs', BarangController::class);
    Route::get('/barangs-low-stock', [BarangController::class, 'lowStock']);

    // Penjualan routes (Kasir for make, Admin/Kasir for view)
    Route::post('/penjualan', [PenjualanController::class, 'store']);
    Route::get('/penjualans', [PenjualanController::class, 'index']);
    Route::get('/penjualans/{penjualan}', [PenjualanController::class, 'show']);

    // Dashboard routes
    Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard']);
    Route::get('/dashboard/kasir', [DashboardController::class, 'kasirDashboard']);
});