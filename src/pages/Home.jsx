import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import '../styles/style.css';

const GITHUB_REPO = 'AldoWijaya27/SIMAK-TPP';
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

// Hardcoded credentials (fake auth, no database needed)
const VALID_USERNAME = 'dishut';
const VALID_PASSWORD = 'hutdis';
const AUTH_KEY = 'simak_auth';

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

// Filter out auto-generated CI lines from GitHub Actions release body
function filterReleaseBody(body) {
  if (!body) return '';
  const filtered = body
    .split('\n')
    .filter(line => {
      const t = line.trim();
      return (
        !t.startsWith('\uD83D\uDCE6') &&   // 📦
        !t.startsWith('\uD83C\uDF3F') &&   // 🌿
        !t.startsWith('\uD83D\uDD28') &&   // 🔨
        !t.match(/^\*\*Ref:\*\*/) &&
        !t.match(/^\*\*Commit:\*\*/)
      );
    })
    .join('\n')
    .trim();
  return filtered;
}

export default function Home() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auth state — persisted in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  // Login popup state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pending download URL (after login, auto-trigger download)
  const [pendingUrl, setPendingUrl] = useState(null);

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

  // Called when a locked download button is clicked
  const handleLockedDownload = (url, e) => {
    e.preventDefault();
    if (isLoggedIn) {
      // Already logged in — proceed directly
      window.location.href = url;
      triggerToast();
    } else {
      // Not logged in — save pending URL and show modal
      setPendingUrl(url);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
      setShowLoginModal(true);
    }
  };

  // Handle login form submit
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    // Simulate a short delay for realism
    setTimeout(() => {
      if (loginUsername === VALID_USERNAME && loginPassword === VALID_PASSWORD) {
        localStorage.setItem(AUTH_KEY, 'true');
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginLoading(false);

        // If there was a pending download, trigger it
        if (pendingUrl) {
          triggerToast();
          setTimeout(() => {
            window.location.href = pendingUrl;
            setPendingUrl(null);
          }, 300);
        }
      } else {
        setLoginError('Username atau password salah. Silakan coba lagi.');
        setLoginLoading(false);
      }
    }, 700);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setPendingUrl(null);
    setLoginError('');
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

          {/* Auth button in header */}
          <div className="header-auth">
            {isLoggedIn ? (
              <button className="btn-logout" onClick={handleLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Keluar
              </button>
            ) : (
              <button className="btn-login-header" onClick={() => { setLoginError(''); setLoginUsername(''); setLoginPassword(''); setShowLoginModal(true); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="blue-bar"></div>

      {/* Main content */}
      <div className="main-wrapper">
        <div className="content-area">
          <h1 className="page-title">Download SIMAK-TPP</h1>

          {/* Login required notice (shown only when not logged in) */}
          {!isLoggedIn && (
            <div className="login-notice">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Anda perlu <strong>masuk</strong> terlebih dahulu untuk mengunduh file SIMAK-TPP.{' '}
              <button className="login-notice-btn" onClick={() => { setLoginError(''); setLoginUsername(''); setLoginPassword(''); setShowLoginModal(true); }}>
                Masuk Sekarang
              </button>
            </div>
          )}

          <p className="page-intro">
            Jika Anda tidak tahu harus mendownload yang mana, kemungkinan besar Anda membutuhkan versi ini:
          </p>

          {/* Big download button */}
          <div className="big-download-box">
            {isLoggedIn ? (
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
            ) : (
              <button className="big-download-btn locked" onClick={(e) => handleLockedDownload(firstAssetUrl, e)}>
                <svg className="dl-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <div className="dl-text">
                  <div className="dl-name">SIMAK-TPP - Windows 64bit</div>
                  <div className="dl-ver">Masuk untuk mengunduh</div>
                </div>
              </button>
            )}
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
                    {isLoggedIn ? (
                      <a href={row.url} className="dl-link" onClick={triggerToast}>
                        {row.name}
                      </a>
                    ) : (
                      <button className="dl-link-locked" onClick={(e) => handleLockedDownload(row.url, e)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle', marginRight:'4px'}}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        {row.name}
                      </button>
                    )}
                  </td>
                  <td>{formatBytes(row.size)}</td>
                  <td>{formatDate(row.date)}</td>
                  <td>
                    {isLoggedIn ? (
                      <a href={row.url} className="btn-small" onClick={triggerToast}>Download</a>
                    ) : (
                      <button className="btn-small locked-btn" onClick={(e) => handleLockedDownload(row.url, e)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle', marginRight:'3px', marginTop:'-1px'}}>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Download
                      </button>
                    )}
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

          {/* Release Notes - Latest Only */}
          {validReleases.length > 0 && (() => {
            const latest = validReleases[0];
            const cleanBody = filterReleaseBody(latest.body);
            const bodyHtml = cleanBody ? marked.parse(cleanBody) : '<i>Tidak ada catatan rilis.</i>';
            return (
              <div id="release-notes-section" style={{ marginTop: '40px' }}>
                <div className="section-bar">Catatan Rilis Terbaru</div>
                <div className="release-note-card">
                  <h3 className="release-note-version">
                    Update Versi {latest.tag_name} <span className="release-note-date">({formatDate(latest.published_at)})</span>
                  </h3>
                  <div className="changelog-content" style={{ marginTop: 0, background: 'transparent', border: 'none', padding: 0 }} dangerouslySetInnerHTML={{ __html: bodyHtml }}>
                  </div>
                </div>
              </div>
            );
          })()}
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

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-logo">
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="36" rx="8" fill="#1a3a6b"/>
                  <rect x="8" y="10" width="20" height="3" rx="1.5" fill="white"/>
                  <rect x="8" y="16" width="14" height="3" rx="1.5" fill="white" opacity="0.7"/>
                  <rect x="8" y="22" width="17" height="3" rx="1.5" fill="white" opacity="0.5"/>
                  <circle cx="26" cy="26" r="7" fill="#2580d4" stroke="white" strokeWidth="1.5"/>
                  <polyline points="23,26 25.5,28.5 29,24" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <div>
                  <div className="modal-title">Masuk ke SIMAK-TPP</div>
                  <div className="modal-subtitle">Masukkan akun Anda untuk mengunduh</div>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal} aria-label="Tutup">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form className="modal-form" onSubmit={handleLogin} autoComplete="off">
              {loginError && (
                <div className="modal-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {loginError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  type="text"
                  className="form-input"
                  placeholder="Masukkan username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  autoFocus
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="input-password-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Masukkan password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(p => !p)} tabIndex={-1} aria-label="Tampilkan password">
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loginLoading}>
                {loginLoading ? (
                  <>
                    <span className="loading-spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', width: '13px', height: '13px' }}></span>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Masuk
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
