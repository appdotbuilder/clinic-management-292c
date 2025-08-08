<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSalesTransactionRequest;
use App\Models\Patient;
use App\Models\Product;
use App\Models\SalesTransaction;
use App\Models\SalesTransactionItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = SalesTransaction::with(['user', 'patient', 'items.product'])
            ->latest('transaction_date')
            ->paginate(10);
        
        return Inertia::render('sales/index', [
            'transactions' => $transactions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::where('stock', '>', 0)->orderBy('name')->get();
        $patients = Patient::orderBy('full_name')->get();
        
        return Inertia::render('sales/create', [
            'products' => $products,
            'patients' => $patients,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSalesTransactionRequest $request)
    {
        DB::transaction(function () use ($request) {
            $data = $request->validated();
            
            // Calculate total amount
            $totalAmount = 0;
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $totalAmount += $product->selling_price * $item['quantity'];
            }
            
            // Create the transaction
            $transaction = SalesTransaction::create([
                'user_id' => Auth::id(),
                'patient_id' => $data['patient_id'] ?? null,
                'total_amount' => $totalAmount,
                'transaction_date' => now(),
            ]);
            
            // Create transaction items and update stock
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Check stock availability
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }
                
                $itemTotal = $product->selling_price * $item['quantity'];
                
                // Create transaction item
                SalesTransactionItem::create([
                    'sales_transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->selling_price,
                    'total_price' => $itemTotal,
                ]);
                
                // Update product stock
                $product->decrement('stock', $item['quantity']);
            }
        });

        return redirect()->route('sales.index')
            ->with('success', 'Sales transaction completed successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesTransaction $sale)
    {
        $sale->load(['user', 'patient', 'items.product']);
        
        return Inertia::render('sales/show', [
            'transaction' => $sale
        ]);
    }
}