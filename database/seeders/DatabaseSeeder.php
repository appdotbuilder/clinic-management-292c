<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@mediclinic.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create doctor user
        User::create([
            'name' => 'Dr. Sarah Johnson',
            'email' => 'doctor@mediclinic.com',
            'password' => Hash::make('password'),
            'role' => 'doctor',
        ]);

        // Create receptionist user
        User::create([
            'name' => 'Maria Lopez',
            'email' => 'receptionist@mediclinic.com',
            'password' => Hash::make('password'),
            'role' => 'receptionist',
        ]);

        // Seed additional data
        $this->call([
            ProductSeeder::class,
            PatientSeeder::class,
            DoctorScheduleSeeder::class,
        ]);
    }
}