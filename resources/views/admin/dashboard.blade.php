@extends('layouts.admin')

@section('title', 'Dashboard Admin')

@section('content')
<div class="admin-page-header">
  <h1 class="admin-page-title">Dashboard</h1>
  <p class="admin-page-subtitle">Selamat datang di panel administrasi SIMAK-TPP.</p>
</div>

<div class="dashboard-cards">
  <div class="dash-card">
    <div class="dash-card-icon">&#128221;</div>
    <div class="dash-card-info">
      <div class="dash-card-label">Total Update</div>
      <div class="dash-card-value" id="updateCount">-</div>
    </div>
    <a href="{{ route('admin.updates.index') }}" class="dash-card-link">Kelola &rarr;</a>
  </div>

  <div class="dash-card">
    <div class="dash-card-icon">&#128190;</div>
    <div class="dash-card-info">
      <div class="dash-card-label">Versi Terbaru GitHub</div>
      <div class="dash-card-value" id="latestVersion">-</div>
    </div>
    <a href="https://github.com/AldoWijaya27/SIMAK-TPP/releases" target="_blank" class="dash-card-link">Lihat &rarr;</a>
  </div>

  <div class="dash-card">
    <div class="dash-card-icon">&#127968;</div>
    <div class="dash-card-info">
      <div class="dash-card-label">Website Publik</div>
      <div class="dash-card-value">Download Page</div>
    </div>
    <a href="{{ route('home') }}" target="_blank" class="dash-card-link">Buka &rarr;</a>
  </div>
</div>

<div class="dash-quick-actions">
  <div class="section-bar" style="margin-top:0;">Aksi Cepat</div>
  <div class="quick-actions-grid">
    <a href="{{ route('admin.updates.create') }}" class="quick-action-btn">
      <span>&#43;</span> Tambah Update / Changelog Baru
    </a>
    <a href="{{ route('admin.updates.index') }}" class="quick-action-btn quick-action-btn-secondary">
      <span>&#128203;</span> Lihat Semua Update
    </a>
  </div>
</div>

@endsection

@push('scripts')
<script>
  // Fetch update count from current page data
  document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/updates-count')
      .catch(() => null);
  });

  // Fetch latest GitHub release version
  fetch('https://api.github.com/repos/AldoWijaya27/SIMAK-TPP/releases/latest')
    .then(r => r.json())
    .then(data => {
      const el = document.getElementById('latestVersion');
      if (el && data.tag_name) el.textContent = data.tag_name;
    })
    .catch(() => {
      const el = document.getElementById('latestVersion');
      if (el) el.textContent = 'N/A';
    });
</script>
@endpush
