<?php

namespace Database\Seeders;

use App\Models\DoctorSchedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class DoctorScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctor = User::where('role', 'doctor')->first();
        
        if ($doctor) {
            $schedules = [
                [
                    'doctor_id' => $doctor->id,
                    'day' => 'monday',
                    'start_time' => '08:00:00',
                    'end_time' => '12:00:00',
                    'specialization' => 'General Medicine',
                ],
                [
                    'doctor_id' => $doctor->id,
                    'day' => 'tuesday',
                    'start_time' => '08:00:00',
                    'end_time' => '12:00:00',
                    'specialization' => 'General Medicine',
                ],
                [
                    'doctor_id' => $doctor->id,
                    'day' => 'wednesday',
                    'start_time' => '08:00:00',
                    'end_time' => '12:00:00',
                    'specialization' => 'General Medicine',
                ],
                [
                    'doctor_id' => $doctor->id,
                    'day' => 'thursday',
                    'start_time' => '08:00:00',
                    'end_time' => '12:00:00',
                    'specialization' => 'General Medicine',
                ],
                [
                    'doctor_id' => $doctor->id,
                    'day' => 'friday',
                    'start_time' => '08:00:00',
                    'end_time' => '12:00:00',
                    'specialization' => 'General Medicine',
                ],
            ];

            foreach ($schedules as $schedule) {
                DoctorSchedule::create($schedule);
            }
        }
    }
}