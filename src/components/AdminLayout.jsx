import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-body">
      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-logo">
            <span className="admin-logo-text">SIMAK-TPP</span>
            <span className="admin-badge">ADMIN</span>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-user-info">{auth.currentUser?.email}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <div className="admin-nav">
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">&#127968;</span> Dashboard
            </NavLink>
            <NavLink 
              to="/admin/updates" 
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">&#128221;</span> Update &amp; Changelog
            </NavLink>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
