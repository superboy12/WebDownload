<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title', 'Admin Dashboard') - SIMAK-TPP</title>
  <link rel="stylesheet" href="{{ asset('css/style.css') }}" />
  <link rel="stylesheet" href="{{ asset('css/admin.css') }}" />
</head>
<body class="admin-body">

  <!-- Admin Top Bar -->
  <div class="admin-topbar">
    <div class="admin-topbar-inner">
      <div class="admin-logo">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="8" fill="#1a3a6b"/>
          <rect x="8" y="10" width="20" height="3" rx="1.5" fill="white"/>
          <rect x="8" y="16" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
          <rect x="8" y="22" width="17" height="3" rx="1.5" fill="white" opacity="0.5"/>
          <circle cx="26" cy="26" r="7" fill="#2580d4" stroke="white" stroke-width="1.5"/>
          <polyline points="23,26 25.5,28.5 29,24" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <span class="admin-logo-text">SIMAK-TPP <span class="admin-badge">Admin</span></span>
      </div>
      <div class="admin-topbar-actions">
        <span class="admin-user-info">&#128100; {{ session('admin_username', 'Admin') }}</span>
        <form method="POST" action="{{ route('admin.logout') }}" style="display:inline;">
          @csrf
          <button type="submit" class="btn-logout">Logout</button>
        </form>
      </div>
    </div>
  </div>

  <div class="admin-layout">
    <!-- Sidebar -->
    <div class="admin-sidebar">
      <nav class="admin-nav">
        <a href="{{ route('admin.dashboard') }}" class="admin-nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
          <span class="nav-icon">&#128202;</span> Dashboard
        </a>
        <a href="{{ route('admin.updates.index') }}" class="admin-nav-link {{ request()->routeIs('admin.updates.*') ? 'active' : '' }}">
          <span class="nav-icon">&#128221;</span> Update & Changelog
        </a>
        <a href="{{ route('home') }}" class="admin-nav-link" target="_blank">
          <span class="nav-icon">&#127968;</span> Lihat Website
        </a>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="admin-content">
      @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
      @endif
      @if(session('error'))
        <div class="alert alert-error">{{ session('error') }}</div>
      @endif

      @yield('content')
    </div>
  </div>

  @stack('scripts')
</body>
</html>
