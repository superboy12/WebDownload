@extends('layouts.admin')

@section('title', 'Tambah Update')

@section('content')
<div class="admin-page-header">
  <div>
    <h1 class="admin-page-title">Tambah Update Baru</h1>
    <p class="admin-page-subtitle">Isi form di bawah untuk menambahkan entri update/changelog.</p>
  </div>
  <a href="{{ route('admin.updates.index') }}" class="btn-secondary">&larr; Kembali</a>
</div>

<div class="form-card">
  <form method="POST" action="{{ route('admin.updates.store') }}" class="admin-form">
    @csrf

    <div class="form-row">
      <div class="form-group">
        <label for="version" class="form-label">Versi <span class="required">*</span></label>
        <input
          type="text"
          id="version"
          name="version"
          class="form-input {{ $errors->has('version') ? 'input-error' : '' }}"
          value="{{ old('version') }}"
          placeholder="Contoh: v1.2.0"
          required
        />
        @error('version')<span class="form-error">{{ $message }}</span>@enderror
      </div>

      <div class="form-group">
        <label for="date" class="form-label">Tanggal Rilis <span class="required">*</span></label>
        <input
          type="date"
          id="date"
          name="date"
          class="form-input {{ $errors->has('date') ? 'input-error' : '' }}"
          value="{{ old('date', date('Y-m-d')) }}"
          required
        />
        @error('date')<span class="form-error">{{ $message }}</span>@enderror
      </div>
    </div>

    <div class="form-group">
      <label for="title" class="form-label">Judul Update <span class="required">*</span></label>
      <input
        type="text"
        id="title"
        name="title"
        class="form-input {{ $errors->has('title') ? 'input-error' : '' }}"
        value="{{ old('title') }}"
        placeholder="Contoh: Perbaikan bug dan peningkatan performa"
        required
      />
      @error('title')<span class="form-error">{{ $message }}</span>@enderror
    </div>

    <div class="form-group">
      <label for="description" class="form-label">Deskripsi Update <span class="required">*</span></label>
      <p class="form-hint">Tulis detail perubahan. Gunakan baris baru untuk memisahkan setiap item.</p>
      <textarea
        id="description"
        name="description"
        class="form-input form-textarea {{ $errors->has('description') ? 'input-error' : '' }}"
        rows="8"
        placeholder="Contoh:&#10;- Perbaikan bug pada perhitungan TPP&#10;- Tambah fitur export Excel&#10;- Update tampilan antarmuka"
        required
      >{{ old('description') }}</textarea>
      @error('description')<span class="form-error">{{ $message }}</span>@enderror
    </div>

    <div class="form-actions">
      <a href="{{ route('admin.updates.index') }}" class="btn-secondary">Batal</a>
      <button type="submit" class="btn-primary" id="submitBtn">Simpan Update</button>
    </div>
  </form>
</div>
@endsection
