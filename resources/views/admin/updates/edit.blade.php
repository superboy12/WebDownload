@extends('layouts.admin')

@section('title', 'Edit Update')

@section('content')
<div class="admin-page-header">
  <div>
    <h1 class="admin-page-title">Edit Update</h1>
    <p class="admin-page-subtitle">Perbarui informasi update/changelog.</p>
  </div>
  <a href="{{ route('admin.updates.index') }}" class="btn-secondary">&larr; Kembali</a>
</div>

<div class="form-card">
  <form method="POST" action="{{ route('admin.updates.update', $update['id']) }}" class="admin-form">
    @csrf
    @method('PUT')

    <div class="form-row">
      <div class="form-group">
        <label for="version" class="form-label">Versi <span class="required">*</span></label>
        <input
          type="text"
          id="version"
          name="version"
          class="form-input {{ $errors->has('version') ? 'input-error' : '' }}"
          value="{{ old('version', $update['version']) }}"
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
          value="{{ old('date', $update['date']) }}"
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
        value="{{ old('title', $update['title']) }}"
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
        required
      >{{ old('description', $update['description']) }}</textarea>
      @error('description')<span class="form-error">{{ $message }}</span>@enderror
    </div>

    <div class="form-actions">
      <a href="{{ route('admin.updates.index') }}" class="btn-secondary">Batal</a>
      <button type="submit" class="btn-primary" id="submitBtn">Simpan Perubahan</button>
    </div>
  </form>
</div>
@endsection
