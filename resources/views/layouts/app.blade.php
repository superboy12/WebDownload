<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title', 'Download SIMAK-TPP')</title>
  <meta name="description" content="@yield('meta_description', 'Download SIMAK-TPP - Aplikasi desktop Windows untuk manajemen data Tambahan Penghasilan Pegawai (TPP).')" />
  <link rel="stylesheet" href="{{ asset('css/style.css') }}" />
</head>
<body>

  <!-- Header -->
  <div class="top-bar">
    <div class="top-bar-inner">
      <div class="logo-area">
        <div class="app-logo">
          <svg class="app-logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#1a3a6b"/>
            <rect x="8" y="10" width="20" height="3" rx="1.5" fill="white"/>
            <rect x="8" y="16" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
            <rect x="8" y="22" width="17" height="3" rx="1.5" fill="white" opacity="0.5"/>
            <circle cx="26" cy="26" r="7" fill="#2580d4" stroke="white" stroke-width="1.5"/>
            <polyline points="23,26 25.5,28.5 29,24" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <div class="app-logo-text">
            <span class="app-logo-name">SIMAK-TPP</span>
            <span class="app-logo-sub">Sistem Informasi Manajemen Tambahan Penghasilan Pegawai</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Blue divider bar -->
  <div class="blue-bar"></div>

  <!-- Main content -->
  <div class="main-wrapper">
    <div class="content-area">
      @yield('content')
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-inner">
      <p>SIMAK-TPP &mdash; Sistem Informasi Manajemen Tambahan Penghasilan Pegawai</p>
      <p>
        <a href="https://github.com/AldoWijaya27/SIMAK-TPP" class="footer-link" target="_blank" rel="noopener">GitHub</a>
        &nbsp;&bull;&nbsp;
        <a href="https://github.com/AldoWijaya27/SIMAK-TPP/releases" class="footer-link" target="_blank" rel="noopener">Semua Versi</a>
      </p>
    </div>
  </div>

  <!-- Toast -->
  <div class="toast" id="toast">Download dimulai! Cek folder Downloads Anda.</div>

  @stack('scripts')
</body>
</html>
