<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Gates for Admin
        Gate::define('access-admin-dashboard', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('manage-barang', function (User $user) {
            return $user->role === 'admin';
        });

        Gate::define('view-penjualan', function (User $user) {
            return $user->role === 'admin' || $user->role === 'kasir';
        });

        // Gates for Kasir
        Gate::define('access-kasir-dashboard', function (User $user) {
            return $user->role === 'kasir';
        });

        Gate::define('make-penjualan', function (User $user) {
            return $user->role === 'kasir';
        });

        // Shared Gates (for viewing, not managing)
        Gate::define('view-barang', function (User $user) {
            return $user->role === 'admin' || $user->role === 'kasir';
        });
    }
}