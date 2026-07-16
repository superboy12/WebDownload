import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../../firebase';

export default function Updates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updatesRef = ref(db, 'updates');
    const unsubscribe = onValue(updatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updateList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort by date DESC
        updateList.sort((a, b) => new Date(b.date) - new Date(a.date));
        setUpdates(updateList);
      } else {
        setUpdates([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus update ini?')) {
      try {
        await remove(ref(db, `updates/${id}`));
      } catch (err) {
        console.error("Error deleting:", err);
        alert('Gagal menghapus update.');
      }
    }
  };

  if (loading) {
    return <div>Memuat...</div>;
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Update &amp; Changelog</h1>
          <p className="admin-page-subtitle">Kelola daftar pembaruan yang ditampilkan di halaman publik.</p>
        </div>
        <Link to="/admin/updates/create" className="btn-primary">
          &#43; Tambah Update
        </Link>
      </div>

      {updates.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">&#128221;</div>
          <p>Belum ada update yang ditambahkan.</p>
          <Link to="/admin/updates/create" className="btn-primary">Tambah Update Pertama</Link>
        </div>
      ) : (
        <table className="dl-table admin-table">
          <thead>
            <tr>
              <th>Versi</th>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Deskripsi</th>
              <th style={{ width: '140px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {updates.map(update => (
              <tr key={update.id}>
                <td><span className="badge-version">{update.version}</span></td>
                <td><strong>{update.title}</strong></td>
                <td>{new Date(update.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="desc-preview">
                  {update.description && update.description.length > 80 
                    ? update.description.substring(0, 80) + '...' 
                    : update.description}
                </td>
                <td>
                  <Link to={`/admin/updates/edit/${update.id}`} className="btn-small btn-edit" style={{ marginRight: '4px' }}>Edit</Link>
                  <button onClick={() => handleDelete(update.id)} className="btn-small btn-delete">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
