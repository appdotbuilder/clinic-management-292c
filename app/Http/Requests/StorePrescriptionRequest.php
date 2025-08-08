<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrescriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->isDoctor() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'visit_id' => 'required|exists:patient_visits,id',
            'product_id' => 'required|exists:products,id',
            'dosage' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'usage_instructions' => 'required|string',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'visit_id.required' => 'Visit ID is required.',
            'product_id.required' => 'Product selection is required.',
            'dosage.required' => 'Dosage is required.',
            'quantity.required' => 'Quantity is required.',
            'quantity.min' => 'Quantity must be at least 1.',
            'usage_instructions.required' => 'Usage instructions are required.',
        ];
    }
}