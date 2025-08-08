<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\SalesTransaction
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $patient_id
 * @property string $total_amount
 * @property string $transaction_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Patient|null $patient
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesTransactionItem> $items
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction wherePatientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction whereTransactionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SalesTransaction whereUserId($value)

 * 
 * @mixin \Eloquent
 */
class SalesTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'patient_id',
        'total_amount',
        'transaction_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'decimal:2',
        'transaction_date' => 'datetime',
    ];

    /**
     * Get the user who made this transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the patient for this transaction.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the items for this transaction.
     */
    public function items(): HasMany
    {
        return $this->hasMany(SalesTransactionItem::class);
    }
}