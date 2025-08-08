import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

export default function CreateProduct() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        stock: 0,
        unit: '',
        purchase_price: 0,
        selling_price: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products');
    };

    const unitOptions = ['tablet', 'capsule', 'bottle', 'box', 'strip', 'tube', 'vial', 'sachet', 'roll'];

    return (
        <AppShell>
            <Head title="Add New Product" />
            
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Link href="/products" className="text-blue-600 hover:text-blue-800">
                            ← Back to Products
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ➕ Add New Product
                    </h1>
                    <p className="text-gray-600">Add a new drug or medical supply to inventory</p>
                </div>

                <div className="max-w-2xl">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Paracetamol 500mg"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Initial Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                        required
                                    />
                                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit
                                    </label>
                                    <select
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select unit</option>
                                        {unitOptions.map((unit) => (
                                            <option key={unit} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Purchase Price (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.purchase_price}
                                        onChange={(e) => setData('purchase_price', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    {errors.purchase_price && <p className="mt-1 text-sm text-red-600">{errors.purchase_price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Selling Price (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.selling_price}
                                        onChange={(e) => setData('selling_price', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    {errors.selling_price && <p className="mt-1 text-sm text-red-600">{errors.selling_price}</p>}
                                </div>
                            </div>

                            {data.purchase_price > 0 && data.selling_price > 0 && (
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <strong>Profit Margin:</strong> Rp {(data.selling_price - data.purchase_price).toLocaleString('id-ID')} 
                                        ({data.purchase_price > 0 ? (((data.selling_price - data.purchase_price) / data.purchase_price) * 100).toFixed(1) : 0}%)
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center space-x-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? '⏳ Saving...' : '💾 Save Product'}
                                </Button>
                                <Link href="/products">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}