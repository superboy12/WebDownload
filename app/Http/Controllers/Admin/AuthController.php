<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (session('admin_logged_in')) {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $adminUsername = config('app.admin_username');
        $adminPassword = config('app.admin_password');

        if ($request->username === $adminUsername && $request->password === $adminPassword) {
            $request->session()->put('admin_logged_in', true);
            $request->session()->put('admin_username', $adminUsername);
            return redirect()->route('admin.dashboard')->with('success', 'Selamat datang, Admin!');
        }

        return back()->withErrors(['login' => 'Username atau password salah.'])->withInput(['username' => $request->username]);
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['admin_logged_in', 'admin_username']);
        return redirect()->route('admin.login')->with('success', 'Berhasil logout.');
    }
}
