@extends('layouts.admin')

@section('title', 'Login Admin')

@section('content')
<div class="login-wrapper">
  <div class="login-box">
    <div class="login-logo">
      <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="8" fill="#1a3a6b"/>
        <rect x="8" y="10" width="20" height="3" rx="1.5" fill="white"/>
        <rect x="8" y="16" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
        <rect x="8" y="22" width="17" height="3" rx="1.5" fill="white" opacity="0.5"/>
        <circle cx="26" cy="26" r="7" fill="#2580d4" stroke="white" stroke-width="1.5"/>
        <polyline points="23,26 25.5,28.5 29,24" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <h2 class="login-title">SIMAK-TPP Admin</h2>
      <p class="login-subtitle">Masuk ke panel administrasi</p>
    </div>

    @if($errors->has('login'))
      <div class="alert alert-error">{{ $errors->first('login') }}</div>
    @endif

    @if(session('success'))
      <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <form method="POST" action="{{ route('admin.login.post') }}" class="login-form">
      @csrf
      <div class="form-group">
        <label for="username" class="form-label">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          class="form-input {{ $errors->has('login') ? 'input-error' : '' }}"
          value="{{ old('username') }}"
          placeholder="Masukkan username"
          autocomplete="username"
          required
        />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          class="form-input {{ $errors->has('login') ? 'input-error' : '' }}"
          placeholder="Masukkan password"
          autocomplete="current-password"
          required
        />
      </div>
      <button type="submit" class="btn-login" id="loginBtn">Masuk</button>
    </form>
  </div>
</div>
@endsection
