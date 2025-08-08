<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Prescription
 *
 * @property int $id
 * @property int $visit_id
 * @property int $product_id
 * @property string $dosage
 * @property int $quantity
 * @property string $usage_instructions
 * @property bool $redeemed
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PatientVisit $visit
 * @property-read \App\Models\Product $product
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription query()
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereDosage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereRedeemed($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereUsageInstructions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Prescription whereVisitId($value)

 * 
 * @mixin \Eloquent
 */
class Prescription extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'visit_id',
        'product_id',
        'dosage',
        'quantity',
        'usage_instructions',
        'redeemed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'redeemed' => 'boolean',
    ];

    /**
     * Get the visit for this prescription.
     */
    public function visit(): BelongsTo
    {
        return $this->belongsTo(PatientVisit::class, 'visit_id');
    }

    /**
     * Get the product for this prescription.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}