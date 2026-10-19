import React from 'react';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Power, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  UserCheck, 
  Clock, 
  UserX,
  Search
} from 'lucide-react';

export default function UserGrid({
  users,
  selectedUserIds,
  onToggleSelectUser,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onResetFilters
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <UserCheck size={13} />;
      case 'Pending':
        return <Clock size={13} />;
      case 'Suspended':
        return <UserX size={13} />;
      default:
        return null;
    }
  };

  if (users.length === 0) {
    return (
      <div className="empty-state-box glass-panel" style={{ padding: '60px 20px', margin: '20px 0' }}>
        <div className="empty-icon-circle">
          <Search size={32} />
        </div>
        <h3>No matching users found</h3>
        <p>Try refining your search term or clearing active filters to view results.</p>
        <button className="btn-secondary" onClick={onResetFilters}>
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="user-grid">
      {users.map((user) => {
        const isSelected = selectedUserIds.includes(user.id);
        return (
          <div 
            key={user.id} 
            className={`user-card glass-panel ${isSelected ? 'card-selected' : ''}`}
          >
            {/* Top Selection & Status Bar */}
            <div className="card-top-bar">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={isSelected}
                onChange={() => onToggleSelectUser(user.id)}
                aria-label={`Select user ${user.name}`}
              />
              <span className={`status-badge ${user.status}`}>
                {getStatusIcon(user.status)}
                {user.status}
              </span>
            </div>

            {/* Profile Avatar & Header */}
            <div className="card-profile-header">
              <div className="card-avatar-wrapper" onClick={() => onViewUser(user)}>
                <img 
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                  alt={user.name} 
                  className="card-avatar-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                  }}
                />
                <span className={`avatar-status-pip status-${user.status?.toLowerCase()}`}></span>
              </div>
              <h4 className="card-name" onClick={() => onViewUser(user)}>
                {user.name}
              </h4>
              <div className="role-dept-stack" style={{ marginTop: '4px' }}>
                <span className="role-pill">
                  <Shield size={12} />
                  {user.role}
                </span>
                <span className="dept-tag">{user.department}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="card-contact-list">
              <div className="card-contact-item">
                <Mail size={14} className="meta-icon" />
                <span className="contact-text" title={user.email}>{user.email}</span>
              </div>
              {user.phone && (
                <div className="card-contact-item">
                  <Phone size={14} className="meta-icon" />
                  <span className="contact-text">{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="card-contact-item">
                  <MapPin size={14} className="meta-icon" />
                  <span className="contact-text">{user.location}</span>
                </div>
              )}
              <div className="card-contact-item">
                <Calendar size={14} className="meta-icon" />
                <span className="contact-text">Joined {user.joinedDate}</span>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="card-actions-footer">
              <button
                className="btn-action view-btn"
                onClick={() => onViewUser(user)}
                title="View Profile Details"
              >
                <Eye size={16} />
              </button>
              <button
                className="btn-action edit-btn"
                onClick={() => onEditUser(user)}
                title="Edit User"
              >
                <Edit3 size={16} />
              </button>
              <button
                className={`btn-action toggle-btn ${user.status === 'Active' ? 'is-active' : ''}`}
                onClick={() => onToggleStatus(user)}
                title={user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
              >
                <Power size={16} />
              </button>
              <button
                className="btn-action delete-btn"
                onClick={() => onDeleteUser(user)}
                title="Delete User"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
