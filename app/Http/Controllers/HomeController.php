<?php

namespace App\Http\Controllers;

use App\Services\FirebaseService;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $updates = [];

        // Only attempt Firebase connection if credentials file exists
        $credentialsPath = base_path(env('FIREBASE_CREDENTIALS', 'firebase/serviceAccountKey.json'));
        if (file_exists($credentialsPath)) {
            try {
                $firebase = app(FirebaseService::class);
                $updates = $firebase->getUpdates();
            } catch (\Throwable $e) {
                // Log error but don't crash the page
                \Log::error('Firebase error on homepage: ' . $e->getMessage());
                $updates = [];
            }
        }

        return view('home', compact('updates'));
    }
}
