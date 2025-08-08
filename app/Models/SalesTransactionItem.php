<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\SalesTransactionItem
 *
 * @property int $id
 * @property int $sales_transaction_id
 * @property int $product_id
 * @property int $quantity
 * @property string $unit_price
 * @property string $total_price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\SalesTransaction $salesTransaction
 * @property-read \App\Models\Product $product
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereSalesTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereTotalPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereUnitPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransactionItem whereUpdatedAt($value)

 * 
 * @mixin \Eloquent
 */
class SalesTransactionItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'sales_transaction_id',
        'product_id',
        'quantity',
        'unit_price',
        'total_price',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Get the sales transaction for this item.
     */
    public function salesTransaction(): BelongsTo
    {
        return $this->belongsTo(SalesTransaction::class);
    }

    /**
     * Get the product for this item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}