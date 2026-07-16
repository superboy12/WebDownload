import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ref, push, set, get, serverTimestamp } from 'firebase/database';
import { db } from '../../firebase';

export default function UpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    version: '',
    date: '',
    description: ''
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchUpdate = async () => {
        try {
          const snapshot = await get(ref(db, `updates/${id}`));
          if (snapshot.exists()) {
            setFormData(snapshot.val());
          } else {
            setError('Update tidak ditemukan.');
          }
        } catch (err) {
          console.error(err);
          setError('Gagal memuat data update.');
        } finally {
          setLoading(false);
        }
      };
      fetchUpdate();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEdit) {
        await set(ref(db, `updates/${id}`), {
          ...formData,
          updated_at: serverTimestamp()
        });
      } else {
        await push(ref(db, 'updates'), {
          ...formData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      }
      navigate('/admin/updates');
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menyimpan data.');
      setSaving(false);
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{isEdit ? 'Edit Update' : 'Tambah Update'}</h1>
          <p className="admin-page-subtitle">
            {isEdit ? 'Ubah informasi rilis dan changelog.' : 'Tambahkan informasi rilis dan changelog baru.'}
          </p>
        </div>
        <Link to="/admin/updates" className="btn-secondary">
          &larr; Kembali
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="form-card admin-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Rilis <span className="required">*</span></label>
            <input 
              type="text" 
              name="title" 
              className="form-input" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="Contoh: Pembaruan Kinerja & Fitur Baru"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Versi <span className="required">*</span></label>
              <input 
                type="text" 
                name="version" 
                className="form-input" 
                value={formData.version} 
                onChange={handleChange} 
                required 
                placeholder="Contoh: v1.0.12"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Rilis <span className="required">*</span></label>
              <input 
                type="date" 
                name="date" 
                className="form-input" 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi / Changelog <span className="required">*</span></label>
            <div className="form-hint">Dukung format Markdown (misal: *italic*, **bold**, atau list -).</div>
            <textarea 
              name="description" 
              className="form-input form-textarea" 
              rows="6" 
              value={formData.description} 
              onChange={handleChange} 
              required
              placeholder="Tuliskan catatan rilis di sini..."
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link to="/admin/updates" className="btn-secondary">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
