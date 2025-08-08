<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DoctorSchedule;
use App\Models\Patient;
use App\Models\PatientVisit;
use App\Models\Product;
use App\Models\SalesTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the appropriate dashboard based on user role.
     */
    public function index()
    {
        $user = Auth::user();
        
        switch ($user->role) {
            case 'admin':
                return $this->adminDashboard();
            case 'doctor':
                return $this->doctorDashboard();
            case 'receptionist':
                return $this->receptionistDashboard();
            default:
                return redirect()->route('login');
        }
    }

    /**
     * Display admin dashboard with analytics and management tools.
     */
    protected function adminDashboard()
    {
        $totalProducts = Product::count();
        $totalUsers = User::count();
        $lowStockProducts = Product::where('stock', '<', 10)->count();
        
        // Sales analytics
        $todaySales = SalesTransaction::whereDate('transaction_date', today())
            ->sum('total_amount');
        
        $weeklySales = SalesTransaction::whereBetween('transaction_date', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ])->sum('total_amount');
        
        $monthlySales = SalesTransaction::whereMonth('transaction_date', now()->month)
            ->whereYear('transaction_date', now()->year)
            ->sum('total_amount');

        // Top selling products this month
        $topProducts = DB::table('sales_transaction_items')
            ->join('sales_transactions', 'sales_transaction_items.sales_transaction_id', '=', 'sales_transactions.id')
            ->join('products', 'sales_transaction_items.product_id', '=', 'products.id')
            ->whereMonth('sales_transactions.transaction_date', now()->month)
            ->whereYear('sales_transactions.transaction_date', now()->year)
            ->select(
                'products.name',
                DB::raw('SUM(sales_transaction_items.quantity) as total_sold'),
                DB::raw('SUM(sales_transaction_items.total_price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalUsers' => $totalUsers,
                'lowStockProducts' => $lowStockProducts,
                'todaySales' => $todaySales,
                'weeklySales' => $weeklySales,
                'monthlySales' => $monthlySales,
            ],
            'topProducts' => $topProducts,
        ]);
    }

    /**
     * Display doctor dashboard with patient management tools.
     */
    protected function doctorDashboard()
    {
        $doctorId = Auth::id();
        
        $totalPatients = PatientVisit::where('doctor_id', $doctorId)
            ->distinct('patient_id')
            ->count();
        
        $todayVisits = PatientVisit::where('doctor_id', $doctorId)
            ->whereDate('visit_date', today())
            ->count();
        
        $recentVisits = PatientVisit::with(['patient'])
            ->where('doctor_id', $doctorId)
            ->latest('visit_date')
            ->limit(5)
            ->get();

        return Inertia::render('doctor/dashboard', [
            'stats' => [
                'totalPatients' => $totalPatients,
                'todayVisits' => $todayVisits,
            ],
            'recentVisits' => $recentVisits,
        ]);
    }

    /**
     * Display receptionist dashboard with scheduling and patient registration.
     */
    protected function receptionistDashboard()
    {
        $totalPatients = Patient::count();
        $todayVisits = PatientVisit::whereDate('visit_date', today())->count();
        
        $todaySchedules = DoctorSchedule::with('doctor')
            ->where('day', strtolower(now()->format('l')))
            ->get();

        $recentPatients = Patient::latest()
            ->limit(5)
            ->get();

        return Inertia::render('receptionist/dashboard', [
            'stats' => [
                'totalPatients' => $totalPatients,
                'todayVisits' => $todayVisits,
            ],
            'todaySchedules' => $todaySchedules,
            'recentPatients' => $recentPatients,
        ]);
    }
}