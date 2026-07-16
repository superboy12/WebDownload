import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import '../styles/style.css';

const GITHUB_REPO = 'AldoWijaya27/SIMAK-TPP';
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

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

export default function Home() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function loadReleases() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('GitHub API error');
        const data = await res.json();
        setReleases(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadReleases();
  }, []);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  // Process rows
  const rows = [];
  const validReleases = [];

  if (!loading && !error) {
    releases.forEach((release, idx) => {
      const assets = (release.assets || []).filter(a => isZipAsset(a.name));
      if (assets.length === 0) return;
      
      validReleases.push(release);
      
      assets.forEach(asset => {
        const isLatest = idx === 0;
        rows.push({
          id: asset.id,
          isLatest,
          version: release.tag_name,
          name: asset.name,
          size: asset.size,
          date: release.published_at,
          url: asset.browser_download_url
        });
      });
    });
  }

  const firstAssetUrl = rows.length > 0 ? rows[0].url : '#';
  const firstVersion = validReleases.length > 0 ? validReleases[0].tag_name : '';

  return (
    <div className="home-page-root">
      {/* Header */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <div className="logo-area">
            <div className="app-logo">
              <svg className="app-logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="#1a3a6b"/>
                <rect x="8" y="10" width="20" height="3" rx="1.5" fill="white"/>
                <rect x="8" y="16" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
                <rect x="8" y="22" width="17" height="3" rx="1.5" fill="white" opacity="0.5"/>
                <circle cx="26" cy="26" r="7" fill="#2580d4" stroke="white" strokeWidth="1.5"/>
                <polyline points="23,26 25.5,28.5 29,24" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <div className="app-logo-text">
                <span className="app-logo-name">SIMAK-TPP</span>
                <span className="app-logo-sub">Sistem Informasi Manajemen Tambahan Penghasilan Pegawai</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="blue-bar"></div>

      {/* Main content */}
      <div className="main-wrapper">
        <div className="content-area">
          <h1 className="page-title">Download SIMAK-TPP</h1>
          <p className="page-intro">
            Jika Anda tidak tahu harus mendownload yang mana, kemungkinan besar Anda membutuhkan versi ini:
          </p>

          {/* Big download button */}
          <div className="big-download-box">
            <a href={firstAssetUrl} className="big-download-btn" onClick={triggerToast}>
              <svg className="dl-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <div className="dl-text">
                <div className="dl-name">SIMAK-TPP - Windows 64bit</div>
                <div className="dl-ver">{firstVersion ? `${firstVersion} • ` : ''}Bahasa Indonesia</div>
              </div>
            </a>
            <div className="dl-note">
              &#9733;&#9733;&#9733;&#9733;&#9734; &nbsp; Gratis &bull; Open Source &bull; Portable
            </div>
          </div>

          {/* Download table */}
          <div className="section-bar">Pilih untuk didownload</div>

          <table className="dl-table">
            <thead>
              <tr>
                <th>Versi</th>
                <th>Nama File</th>
                <th>Ukuran</th>
                <th>Tanggal Rilis</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="tbl-loading">
                    <span className="loading-spinner"></span> Memuat daftar versi dari GitHub...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="5" className="tbl-error">
                    Gagal memuat daftar versi. <a href={`https://github.com/${GITHUB_REPO}/releases`} target="_blank" rel="noopener noreferrer">Buka GitHub Releases &rarr;</a>
                  </td>
                </tr>
              )}
              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td colSpan="5" className="tbl-empty">Belum ada release yang tersedia.</td>
                </tr>
              )}
              {!loading && !error && rows.map(row => (
                <tr key={row.id}>
                  <td>
                    {row.isLatest ? (
                      <><span className="badge-latest">Latest</span> <span className="badge-version">{row.version}</span></>
                    ) : (
                      <span className="badge-version">{row.version}</span>
                    )}
                  </td>
                  <td>
                    <a href={row.url} className="dl-link" onClick={triggerToast}>
                      {row.name}
                    </a>
                  </td>
                  <td>{formatBytes(row.size)}</td>
                  <td>{formatDate(row.date)}</td>
                  <td>
                    <a href={row.url} className="btn-small" onClick={triggerToast}>Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="dl-all-versions">
            Butuh versi lama?
            <a href={`https://github.com/${GITHUB_REPO}/releases`} target="_blank" rel="noopener noreferrer">
              Lihat semua versi di GitHub Releases &rarr;
            </a>
          </p>

          {/* Release Notes Section */}
          {validReleases.length > 0 && (
            <div id="release-notes-section" style={{ marginTop: '40px' }}>
              <div className="section-bar">Catatan Rilis (Changelog)</div>
              <div id="release-notes-container">
                {validReleases.map(release => {
                  let bodyHtml = '<i>Tidak ada catatan rilis.</i>';
                  if (release.body) {
                    bodyHtml = marked.parse(release.body);
                  }
                  return (
                    <div className="release-note-card" key={release.id}>
                      <h3 className="release-note-version">
                        Update Versi {release.tag_name} <span className="release-note-date">({formatDate(release.published_at)})</span>
                      </h3>
                      <div className="changelog-content" style={{ marginTop: 0, background: 'transparent', border: 'none', padding: 0 }} dangerouslySetInnerHTML={{ __html: bodyHtml }}>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info section */}
          <div className="section-bar">Cara Menggunakan</div>
          <ol className="how-to-list">
            <li>Download file <strong>SIMAK-TPP-Windows-latest.zip</strong> menggunakan tombol di atas.</li>
            <li>Klik kanan pada file ZIP yang sudah didownload, pilih <strong>"Extract All..."</strong> dan pilih folder tujuan.</li>
            <li>Buka folder hasil ekstrak, lalu jalankan file <strong>SIMAK-TPP.exe</strong>.</li>
          </ol>
          <div className="note-box">
            <strong>&#9888; Perhatian:</strong> Semua file dalam folder hasil ekstrak ZIP harus tetap berada dalam
            <strong>satu folder yang sama</strong> dengan <code>SIMAK-TPP.exe</code>.
            Jangan memindahkan file <code>.exe</code> ke luar folder.
          </div>

          {/* About section */}
          <div className="section-bar">Tentang SIMAK-TPP</div>
          <p className="about-text">
            SIMAK-TPP adalah aplikasi desktop untuk Windows yang dirancang membantu pengelolaan data
            <strong>Tambahan Penghasilan Pegawai (TPP)</strong>. Aplikasi ini bersifat <em>portable</em>
            sehingga tidak memerlukan proses instalasi. Cukup ekstrak dan langsung jalankan.
          </p>
          <p className="about-text">
            Source code tersedia secara terbuka di
            <a href={`https://github.com/${GITHUB_REPO}`} className="dl-link" target="_blank" rel="noopener noreferrer">GitHub Repository</a>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-inner">
          <p>SIMAK-TPP &mdash; Sistem Informasi Manajemen Tambahan Penghasilan Pegawai</p>
          <p>
            <a href={`https://github.com/${GITHUB_REPO}`} className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
            &nbsp;&bull;&nbsp;
            <a href={`https://github.com/${GITHUB_REPO}/releases`} className="footer-link" target="_blank" rel="noopener noreferrer">Semua Versi</a>
          </p>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${showToast ? 'show' : ''}`}>Download dimulai! Cek folder Downloads Anda.</div>
    </div>
  );
}
