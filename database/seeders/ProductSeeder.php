<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Paracetamol 500mg',
                'stock' => 100,
                'unit' => 'tablet',
                'purchase_price' => 500.00,
                'selling_price' => 1000.00,
            ],
            [
                'name' => 'Amoxicillin 250mg',
                'stock' => 50,
                'unit' => 'capsule',
                'purchase_price' => 1500.00,
                'selling_price' => 2500.00,
            ],
            [
                'name' => 'Ibuprofen 400mg',
                'stock' => 75,
                'unit' => 'tablet',
                'purchase_price' => 800.00,
                'selling_price' => 1500.00,
            ],
            [
                'name' => 'Vitamin C 1000mg',
                'stock' => 5, // Low stock item
                'unit' => 'tablet',
                'purchase_price' => 2000.00,
                'selling_price' => 3500.00,
            ],
            [
                'name' => 'Cough Syrup',
                'stock' => 30,
                'unit' => 'bottle',
                'purchase_price' => 15000.00,
                'selling_price' => 25000.00,
            ],
            [
                'name' => 'Antiseptic',
                'stock' => 20,
                'unit' => 'bottle',
                'purchase_price' => 8000.00,
                'selling_price' => 15000.00,
            ],
            [
                'name' => 'Bandage',
                'stock' => 40,
                'unit' => 'roll',
                'purchase_price' => 5000.00,
                'selling_price' => 10000.00,
            ],
            [
                'name' => 'Aspirin 100mg',
                'stock' => 60,
                'unit' => 'tablet',
                'purchase_price' => 600.00,
                'selling_price' => 1200.00,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}