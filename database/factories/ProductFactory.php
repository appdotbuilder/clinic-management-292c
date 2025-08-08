<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $units = ['tablet', 'capsule', 'bottle', 'box', 'strip', 'tube', 'vial', 'sachet'];
        $purchasePrice = fake()->randomFloat(2, 1000, 50000);
        
        return [
            'name' => fake()->randomElement([
                'Paracetamol 500mg',
                'Amoxicillin 250mg',
                'Ibuprofen 400mg',
                'Vitamin C 1000mg',
                'Aspirin 100mg',
                'Cough Syrup',
                'Antiseptic',
                'Bandage',
                'Omeprazole 20mg',
                'Cetirizine 10mg',
            ]),
            'stock' => fake()->numberBetween(0, 200),
            'unit' => fake()->randomElement($units),
            'purchase_price' => $purchasePrice,
            'selling_price' => $purchasePrice * fake()->randomFloat(1, 1.5, 3.0), // 50-200% markup
        ];
    }
}