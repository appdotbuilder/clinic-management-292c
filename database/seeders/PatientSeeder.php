<?php

namespace Database\Seeders;

use App\Models\Patient;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patients = [
            [
                'full_name' => 'John Doe',
                'nik' => '1234567890123456',
                'date_of_birth' => '1985-03-15',
                'gender' => 'male',
                'address' => 'Jl. Merdeka No. 123, Jakarta',
                'phone_number' => '081234567890',
            ],
            [
                'full_name' => 'Jane Smith',
                'nik' => '1234567890123457',
                'date_of_birth' => '1990-07-22',
                'gender' => 'female',
                'address' => 'Jl. Sudirman No. 456, Jakarta',
                'phone_number' => '081234567891',
            ],
            [
                'full_name' => 'Robert Wilson',
                'nik' => '1234567890123458',
                'date_of_birth' => '1978-11-08',
                'gender' => 'male',
                'address' => 'Jl. Gatot Subroto No. 789, Jakarta',
                'phone_number' => '081234567892',
            ],
            [
                'full_name' => 'Maria Garcia',
                'nik' => '1234567890123459',
                'date_of_birth' => '1992-05-14',
                'gender' => 'female',
                'address' => 'Jl. Thamrin No. 321, Jakarta',
                'phone_number' => '081234567893',
            ],
            [
                'full_name' => 'Ahmad Sari',
                'nik' => '1234567890123460',
                'date_of_birth' => '1987-09-30',
                'gender' => 'male',
                'address' => 'Jl. Kuningan No. 654, Jakarta',
                'phone_number' => '081234567894',
            ],
        ];

        foreach ($patients as $patient) {
            Patient::create($patient);
        }
    }
}