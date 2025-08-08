<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\PatientVisit
 *
 * @property int $id
 * @property int $patient_id
 * @property int $doctor_id
 * @property string $visit_date
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Patient $patient
 * @property-read \App\Models\User $doctor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Prescription> $prescriptions
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit query()
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit whereDoctorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit wherePatientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PatientVisit whereVisitDate($value)

 * 
 * @mixin \Eloquent
 */
class PatientVisit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'visit_date',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'visit_date' => 'datetime',
    ];

    /**
     * Get the patient for this visit.
     */
    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the doctor for this visit.
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    /**
     * Get the prescriptions for this visit.
     */
    public function prescriptions(): HasMany
    {
        return $this->hasMany(Prescription::class, 'visit_id');
    }
}