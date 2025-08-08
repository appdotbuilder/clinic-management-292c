import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Product {
    id: number;
    name: string;
    stock: number;
    unit: string;
    selling_price: string;
}

interface Patient {
    id: number;
    full_name: string;
    nik: string;
}

interface CartItem {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    unit: string;
    available_stock: number;
}



interface Props {
    products: Product[];
    patients: Patient[];
    [key: string]: unknown;
}

export default function CreateSale({ products, patients }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const { data, setData, post, processing } = useForm({
        patient_id: null as number | null,
        items: [] as { product_id: number; quantity: number }[],
    });

    const addToCart = () => {
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct) return;

        const existingItemIndex = cart.findIndex(item => item.product_id === selectedProductId);
        
        if (existingItemIndex >= 0) {
            const updatedCart = [...cart];
            const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
            
            if (newQuantity <= selectedProduct.stock) {
                updatedCart[existingItemIndex].quantity = newQuantity;
                setCart(updatedCart);
            } else {
                alert(`Cannot add more than ${selectedProduct.stock} items (available stock)`);
            }
        } else {
            if (quantity <= selectedProduct.stock) {
                const newItem: CartItem = {
                    product_id: selectedProduct.id,
                    product_name: selectedProduct.name,
                    quantity: quantity,
                    unit_price: parseFloat(selectedProduct.selling_price),
                    unit: selectedProduct.unit,
                    available_stock: selectedProduct.stock,
                };
                setCart([...cart, newItem]);
            } else {
                alert(`Cannot add more than ${selectedProduct.stock} items (available stock)`);
            }
        }

        setSelectedProductId(null);
        setQuantity(1);
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const updateCartQuantity = (productId: number, newQuantity: number) => {
        const item = cart.find(item => item.product_id === productId);
        if (!item) return;

        if (newQuantity > item.available_stock) {
            alert(`Cannot exceed available stock of ${item.available_stock} items`);
            return;
        }

        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCart(cart.map(item => 
            item.product_id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Please add at least one item to the cart');
            return;
        }

        // Update form data before submitting
        setData('items', cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
        })));

        post('/sales');
    };

    const availableProducts = products.filter(p => 
        p.stock > 0 && !cart.find(item => item.product_id === p.id)
    );

    return (
        <AppShell>
            <Head title="New Sales Transaction" />
            
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Link href="/sales" className="text-blue-600 hover:text-blue-800">
                            ← Back to Sales
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        💰 New Sales Transaction
                    </h1>
                    <p className="text-gray-600">Process a new sale transaction</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Product Selection & Cart */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Product Selection */}
                            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛒 Add Products</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Product
                                        </label>
                                        <select
                                            value={selectedProductId || ''}
                                            onChange={(e) => setSelectedProductId(parseInt(e.target.value) || null)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Choose a product</option>
                                            {availableProducts.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} (Stock: {product.stock} {product.unit}) - Rp {parseFloat(product.selling_price).toLocaleString('id-ID')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                min="1"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <Button
                                                type="button"
                                                onClick={addToCart}
                                                disabled={!selectedProductId}
                                                className="rounded-l-none"
                                            >
                                                ➕
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cart */}
                            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛍️ Cart ({cart.length} items)</h3>
                                {cart.length > 0 ? (
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <div key={item.product_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Rp {item.unit_price.toLocaleString('id-ID')} per {item.unit}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateCartQuantity(item.product_id, parseInt(e.target.value) || 0)}
                                                        min="1"
                                                        max={item.available_stock}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                                                    />
                                                    <span className="text-sm text-gray-500">
                                                        × Rp {item.unit_price.toLocaleString('id-ID')}
                                                    </span>
                                                    <span className="font-semibold text-gray-900 min-w-[100px] text-right">
                                                        Rp {(item.unit_price * item.quantity).toLocaleString('id-ID')}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item.product_id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-4xl mb-4">🛍️</div>
                                        <p className="text-gray-500">Cart is empty</p>
                                        <p className="text-sm text-gray-400">Add products to create a transaction</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Customer & Summary */}
                        <div className="space-y-6">
                            {/* Customer Selection */}
                            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Customer (Optional)</h3>
                                <select
                                    value={data.patient_id || ''}
                                    onChange={(e) => setData('patient_id', parseInt(e.target.value) || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Walk-in Customer</option>
                                    {patients.map((patient) => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.full_name} (NIK: {patient.nik})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Transaction Summary */}
                            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Transaction Summary</h3>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Items:</span>
                                        <span>{cart.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total:</span>
                                        <span className="text-green-600">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || cart.length === 0}
                                    className="w-full"
                                >
                                    {processing ? '⏳ Processing...' : '💳 Complete Transaction'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}