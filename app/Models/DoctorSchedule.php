<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\DoctorSchedule
 *
 * @property int $id
 * @property int $doctor_id
 * @property string $day
 * @property string $start_time
 * @property string $end_time
 * @property string $specialization
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $doctor
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereDoctorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereSpecialization($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DoctorSchedule whereUpdatedAt($value)

 * 
 * @mixin \Eloquent
 */
class DoctorSchedule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'doctor_id',
        'day',
        'start_time',
        'end_time',
        'specialization',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    /**
     * Get the doctor for this schedule.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}