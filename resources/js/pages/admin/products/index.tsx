import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Product {
    id: number;
    name: string;
    stock: number;
    unit: string;
    purchase_price: string;
    selling_price: string;
    created_at: string;
}

interface Props {
    products: {
        data: Product[];
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
    };
    [key: string]: unknown;
}

export default function ProductIndex({ products }: Props) {
    const handleDelete = (product: Product) => {
        if (confirm(`Are you sure you want to delete ${product.name}?`)) {
            router.delete(`/products/${product.id}`);
        }
    };

    return (
        <AppShell>
            <Head title="Product Management" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            💊 Product Management
                        </h1>
                        <p className="text-gray-600">Manage drugs and medical supplies</p>
                    </div>
                    <Link href="/products/create">
                        <Button>
                            ➕ Add New Product
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-100">
                    <div className="p-6">
                        {products.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Unit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Purchase Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Selling Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.name}
                                                        </div>
                                                        {product.stock < 10 && (
                                                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                                                Low Stock
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm ${product.stock < 10 ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.unit}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Rp {parseFloat(product.purchase_price).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Rp {parseFloat(product.selling_price).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link href={`/products/${product.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                👁️ View
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/products/${product.id}/edit`}>
                                                            <Button size="sm" variant="outline">
                                                                ✏️ Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDelete(product)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            🗑️ Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">💊</div>
                                <p className="text-gray-500 text-lg mb-4">No products found</p>
                                <p className="text-gray-400 mb-6">Start by adding your first product</p>
                                <Link href="/products/create">
                                    <Button>
                                        ➕ Add First Product
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}