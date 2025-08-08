<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePrescriptionRequest;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrescriptionController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePrescriptionRequest $request)
    {
        $prescription = Prescription::create($request->validated());

        return redirect()->back()
            ->with('success', 'Prescription added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Prescription $prescription)
    {
        $request->validate([
            'redeemed' => 'required|boolean',
        ]);

        $prescription->update([
            'redeemed' => $request->redeemed,
        ]);

        return redirect()->back()
            ->with('success', 'Prescription updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prescription $prescription)
    {
        $prescription->delete();

        return redirect()->back()
            ->with('success', 'Prescription deleted successfully.');
    }
}