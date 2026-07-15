@extends('layouts.admin')

@section('title', 'Daftar Update & Changelog')

@section('content')
<div class="admin-page-header">
  <div>
    <h1 class="admin-page-title">Update &amp; Changelog</h1>
    <p class="admin-page-subtitle">Kelola daftar pembaruan yang ditampilkan di halaman publik.</p>
  </div>
  <a href="{{ route('admin.updates.create') }}" class="btn-primary" id="addUpdateBtn">
    &#43; Tambah Update
  </a>
</div>

@if(count($updates) === 0)
  <div class="empty-state">
    <div class="empty-icon">&#128221;</div>
    <p>Belum ada update yang ditambahkan.</p>
    <a href="{{ route('admin.updates.create') }}" class="btn-primary">Tambah Update Pertama</a>
  </div>
@else
  <table class="dl-table admin-table">
    <thead>
      <tr>
        <th>Versi</th>
        <th>Judul</th>
        <th>Tanggal</th>
        <th>Deskripsi</th>
        <th style="width:140px;">Aksi</th>
      </tr>
    </thead>
    <tbody>
      @foreach($updates as $update)
      <tr>
        <td><span class="badge-version">{{ $update['version'] }}</span></td>
        <td><strong>{{ $update['title'] }}</strong></td>
        <td>{{ \Carbon\Carbon::parse($update['date'])->isoFormat('DD MMM YYYY') }}</td>
        <td class="desc-preview">{{ Str::limit($update['description'], 80) }}</td>
        <td>
          <a href="{{ route('admin.updates.edit', $update['id']) }}" class="btn-small btn-edit">Edit</a>
          <form method="POST" action="{{ route('admin.updates.destroy', $update['id']) }}" style="display:inline;" onsubmit="return confirm('Yakin ingin menghapus update ini?')">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn-small btn-delete">Hapus</button>
          </form>
        </td>
      </tr>
      @endforeach
    </tbody>
  </table>
@endif
@endsection
