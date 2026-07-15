@extends('layouts.app')

@section('title', 'Download SIMAK-TPP')
@section('meta_description', 'Download SIMAK-TPP - Aplikasi desktop Windows untuk manajemen data Tambahan Penghasilan Pegawai (TPP).')

@section('content')

  <h1 class="page-title">Download SIMAK-TPP</h1>
  <p class="page-intro">
    Jika Anda tidak tahu harus mendownload yang mana, kemungkinan besar Anda membutuhkan versi ini:
  </p>

  <!-- Big download button -->
  <!-- Big download button -->
  <div class="big-download-box">
    <a href="https://github.com/AldoWijaya27/SIMAK-TPP/releases/latest/download/SIMAK-TPP-Windows-latest.zip"
       class="big-download-btn"
       id="mainDownloadBtn"
       onclick="showToast()">
      <svg class="dl-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <div class="dl-text">
        <div class="dl-name">SIMAK-TPP - Windows 64bit</div>
        <div class="dl-ver" id="mainDownloadVer">Versi terbaru &bull; Bahasa Indonesia</div>
      </div>
    </a>
    <div class="dl-note">
      &#9733;&#9733;&#9733;&#9733;&#9734; &nbsp; Gratis &bull; Open Source &bull; Portable
    </div>
  </div>

  <!-- Download table -->
  <div class="section-bar" id="select-download">Pilih untuk didownload</div>

  <table class="dl-table" id="releaseTable">
    <thead>
      <tr>
        <th>Versi</th>
        <th>Nama File</th>
        <th>Ukuran</th>
        <th>Tanggal Rilis</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody id="releaseTableBody">
      <tr id="loadingRow">
        <td colspan="5" class="tbl-loading">
          <span class="loading-spinner"></span> Memuat daftar versi dari GitHub...
        </td>
      </tr>
    </tbody>
  </table>

  <p class="dl-all-versions">
    Butuh versi lama?
    <a href="https://github.com/AldoWijaya27/SIMAK-TPP/releases" id="allVersionsLink" target="_blank" rel="noopener">
      Lihat semua versi di GitHub Releases &rarr;
    </a>
  </p>

  <!-- Update & Changelog section (from GitHub) -->
  <div class="section-bar">Update &amp; Changelog</div>
  <div class="changelog-list" id="githubChangelogContainer">
    <div style="padding:15px; color:#666; font-style:italic;">Memuat changelog dari GitHub...</div>
  </div>

  <!-- Info section -->
  <div class="section-bar">Cara Menggunakan</div>

  <ol class="how-to-list">
    <li>Download file <strong>SIMAK-TPP-Windows-latest.zip</strong> menggunakan tombol di atas.</li>
    <li>Klik kanan pada file ZIP yang sudah didownload, pilih <strong>"Extract All..."</strong> dan pilih folder tujuan.</li>
    <li>Buka folder hasil ekstrak, lalu jalankan file <strong>SIMAK-TPP.exe</strong>.</li>
  </ol>

  <div class="note-box">
    <strong>&#9888; Perhatian:</strong> Semua file dalam folder hasil ekstrak ZIP harus tetap berada dalam
    <strong>satu folder yang sama</strong> dengan <code>SIMAK-TPP.exe</code>.
    Jangan memindahkan file <code>.exe</code> ke luar folder.
  </div>

  <!-- About section -->
  <div class="section-bar">Tentang SIMAK-TPP</div>
  <p class="about-text">
    SIMAK-TPP adalah aplikasi desktop untuk Windows yang dirancang membantu pengelolaan data
    <strong>Tambahan Penghasilan Pegawai (TPP)</strong>. Aplikasi ini bersifat <em>portable</em>
    sehingga tidak memerlukan proses instalasi. Cukup ekstrak dan langsung jalankan.
  </p>
  <p class="about-text">
    Source code tersedia secara terbuka di
    <a href="https://github.com/AldoWijaya27/SIMAK-TPP" class="dl-link" target="_blank" rel="noopener">GitHub Repository</a>.
  </p>

@endsection

@push('scripts')
<script>
  const GITHUB_REPO = 'AldoWijaya27/SIMAK-TPP';
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

  function showToast() {
    const t = document.getElementById('toast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
  }

  function formatBytes(bytes) {
    if (!bytes) return '-';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? mb.toFixed(1) + ' MB' : (bytes / 1024).toFixed(0) + ' KB';
  }

  function formatDate(iso) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function isZipAsset(name) {
    return name.toLowerCase().endsWith('.zip');
  }

  async function loadReleases() {
    const tbody = document.getElementById('releaseTableBody');
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('GitHub API error: ' + res.status);
      let releases = await res.json();
      
      // Pastikan data selalu diurutkan berdasarkan tanggal rilis dari yang terbaru ke terlama
      releases.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

      const rows = [];
      const changelogs = [];

      releases.forEach((release, idx) => {
        const assets = (release.assets || []).filter(a => isZipAsset(a.name));
        if (assets.length === 0) return;

        assets.forEach(asset => {
          const isLatest = idx === 0;
          const versionBadge = isLatest
            ? `<span class="badge-latest">Latest</span> <span class="badge-version">${release.tag_name}</span>`
            : `<span class="badge-version">${release.tag_name}</span>`;

          rows.push(`
            <tr>
              <td>${versionBadge}</td>
              <td>
                <a href="${asset.browser_download_url}" class="dl-link" onclick="showToast()">
                  ${asset.name}
                </a>
              </td>
              <td>${formatBytes(asset.size)}</td>
              <td>${formatDate(release.published_at)}</td>
              <td>
                <a href="${asset.browser_download_url}" class="btn-small" onclick="showToast()">Download</a>
              </td>
            </tr>
          `);
        });

        if (idx === 0) {
          // Clean up GitHub Action boilerplate from the release body
          let bodyText = release.body || 'Tidak ada catatan perubahan.';
          
          if (bodyText.includes('### Changelog / Perubahan')) {
            let parts = bodyText.split('### Changelog / Perubahan');
            bodyText = parts[1].split('### Cara Install')[0].trim();
          } else {
             if (bodyText.includes('### Cara Install')) {
                bodyText = bodyText.split('### Cara Install')[0].trim();
             }
             bodyText = bodyText.replace(/## SIMAK-TPP.*/g, '').trim();
             bodyText = bodyText.replace(/📦 Build otomatis.*/g, '').trim();
             bodyText = bodyText.replace(/🔨 Commit:.*/g, '').trim();
          }
          
          if (!bodyText) bodyText = 'Pembaruan rutin. Tidak ada catatan perubahan khusus.';

          // Basic Markdown replacement for newlines, bold, lists, and links
          let bodyHtml = bodyText
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\r\n|\r|\n/g, '<br />')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
          
          changelogs.push(`
            <div class="changelog-item">
              <div class="changelog-header">
                <span class="badge-latest" style="vertical-align:middle;">${release.tag_name}</span>
                <span class="changelog-date" style="margin-left: 8px;">${formatDate(release.published_at)}</span>
              </div>
              <div class="changelog-desc" style="line-height:1.6; margin-top: 5px;">
                ${bodyHtml}
              </div>
            </div>
          `);
        }
      });

      if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="tbl-empty">Belum ada release yang tersedia.</td></tr>`;
        document.getElementById('githubChangelogContainer').innerHTML = `<div style="padding:15px;">Belum ada changelog.</div>`;
      } else {
        tbody.innerHTML = rows.join('');
        document.getElementById('githubChangelogContainer').innerHTML = changelogs.join('');
        
        const firstRelease = releases.find(r => (r.assets || []).some(a => isZipAsset(a.name)));
        if (firstRelease) {
          const firstAsset = firstRelease.assets.find(a => isZipAsset(a.name));
          const mainBtn = document.getElementById('mainDownloadBtn');
          if (mainBtn && firstAsset) {
            mainBtn.href = firstAsset.browser_download_url;
            const verEl = mainBtn.querySelector('#mainDownloadVer');
            if (verEl) verEl.textContent = `${firstRelease.tag_name} \u2022 Bahasa Indonesia`;
          }
        }
      }
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="5" class="tbl-error">
        Gagal memuat daftar versi. <a href="https://github.com/${GITHUB_REPO}/releases" target="_blank" rel="noopener">Buka GitHub Releases &rarr;</a>
      </td></tr>`;
    }
  }

  loadReleases();
</script>
@endpush
