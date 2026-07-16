import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Admin</h1>
          <p className="admin-page-subtitle">Selamat datang di Panel Admin SIMAK-TPP</p>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dash-card">
          <div className="dash-card-icon">&#128221;</div>
          <div className="dash-card-label">Kelola Pembaruan</div>
          <div className="dash-card-value">Updates</div>
          <Link to="/admin/updates" className="dash-card-link">Lihat Daftar Update &rarr;</Link>
        </div>
      </div>

      <div className="section-bar" style={{ background: 'transparent', color: '#1a3a6b', borderBottom: '2px solid #1a3a6b', padding: '0 0 8px 0', margin: '30px 0 16px 0', fontSize: '14px' }}>
        Aksi Cepat
      </div>
      
      <div className="quick-actions-grid">
        <Link to="/admin/updates/create" className="quick-action-btn">
          &#43; Tambah Update Baru
        </Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="quick-action-btn quick-action-btn-secondary">
          &#127760; Lihat Halaman Publik
        </a>
      </div>
    </>
  );
}
