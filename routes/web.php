<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientVisitController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesTransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard - redirects based on role
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Product management (Admin only)
    Route::resource('products', ProductController::class);
    
    // Patient management (All roles)
    Route::resource('patients', PatientController::class);
    
    // Patient visits (Doctors only)
    Route::resource('visits', PatientVisitController::class)->only(['index', 'create', 'store', 'show']);
    
    // Prescriptions (Doctors only)
    Route::resource('prescriptions', PrescriptionController::class)->only(['store', 'update', 'destroy']);
    
    // Sales transactions (Admin and Receptionist)
    Route::resource('sales', SalesTransactionController::class)->only(['index', 'create', 'store', 'show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';