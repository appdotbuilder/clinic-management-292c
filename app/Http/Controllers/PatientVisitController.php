<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientVisitRequest;
use App\Models\Patient;
use App\Models\PatientVisit;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PatientVisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $visits = PatientVisit::with(['patient', 'doctor'])
            ->where('doctor_id', Auth::id())
            ->latest('visit_date')
            ->paginate(10);
        
        return Inertia::render('doctor/visits/index', [
            'visits' => $visits
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $patients = Patient::orderBy('full_name')->get();
        
        return Inertia::render('doctor/visits/create', [
            'patients' => $patients
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientVisitRequest $request)
    {
        $visit = PatientVisit::create([
            ...$request->validated(),
            'doctor_id' => Auth::id(),
        ]);

        return redirect()->route('visits.show', $visit)
            ->with('success', 'Patient visit recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PatientVisit $visit)
    {
        $visit->load(['patient', 'doctor', 'prescriptions.product']);
        $products = Product::where('stock', '>', 0)->orderBy('name')->get();
        
        return Inertia::render('doctor/visits/show', [
            'visit' => $visit,
            'products' => $products,
        ]);
    }
}