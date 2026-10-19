import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  Building2, 
  Edit3, 
  Trash2, 
  Power, 
  CheckCircle2, 
  Activity, 
  KeyRound,
  ExternalLink
} from 'lucide-react';

export default function UserDetailsDrawer({
  user,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  if (!isOpen || !user) return null;

  const mockAuditLogs = [
    { id: 1, action: 'User authentication successful (SSO)', time: user.lastActive || '10 mins ago', icon: Activity },
    { id: 2, action: `Assigned role "${user.role}" in ${user.department}`, time: `Joined on ${user.joinedDate}`, icon: ShieldCheck },
    { id: 3, action: 'Identity credentials provisioned', time: `${user.joinedDate}`, icon: KeyRound }
  ];

  return (
    <div className="drawer-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="drawer-panel glass-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <span className="drawer-eyebrow">User Profile Overview</span>
          <button 
            id="drawer-close-btn"
            className="btn-ghost icon-circle" 
            onClick={onClose}
            aria-label="Close user details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {/* User Hero Banner */}
          <div className="drawer-hero">
            <div className="drawer-avatar-wrap">
              <img 
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                alt={user.name} 
                className="drawer-avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                }}
              />
              <span className={`drawer-avatar-pip status-${user.status?.toLowerCase()}`}></span>
            </div>

            <h3 className="drawer-user-name">{user.name}</h3>
            <span className={`status-badge ${user.status}`} style={{ margin: '8px auto' }}>
              {user.status}
            </span>

            {/* Quick Actions Row */}
            <div className="drawer-quick-actions">
              <button 
                id="drawer-edit-btn"
                className="btn-secondary btn-sm"
                onClick={() => {
                  onClose();
                  onEdit(user);
                }}
              >
                <Edit3 size={15} />
                Edit
              </button>

              <button 
                className={`btn-secondary btn-sm ${user.status === 'Active' ? 'text-amber' : 'text-emerald'}`}
                onClick={() => onToggleStatus(user)}
              >
                <Power size={15} />
                {user.status === 'Active' ? 'Suspend' : 'Activate'}
              </button>

              <button 
                className="btn-secondary btn-sm text-red"
                onClick={() => {
                  onClose();
                  onDelete(user);
                }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Contact & Location</h4>
            <div className="drawer-info-grid">
              <div className="drawer-info-item">
                <span className="drawer-info-label">
                  <Mail size={13} /> Work Email
                </span>
                <a href={`mailto:${user.email}`} className="drawer-info-val link">
                  {user.email}
                </a>
              </div>

              <div className="drawer-info-item">
                <span className="drawer-info-label">
                  <Phone size={13} /> Phone
                </span>
                <span className="drawer-info-val">
                  {user.phone || 'Not specified'}
                </span>
              </div>

              <div className="drawer-info-item">
                <span className="drawer-info-label">
                  <MapPin size={13} /> Location
                </span>
                <span className="drawer-info-val">
                  {user.location || 'Remote'}
                </span>
              </div>

              <div className="drawer-info-item">
                <span className="drawer-info-label">
                  <Calendar size={13} /> Member Since
                </span>
                <span className="drawer-info-val">
                  {user.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Role & Access Privileges */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Role & Authorization</h4>
            <div className="drawer-info-grid">
              <div className="drawer-info-item">
                <span className="drawer-info-label">
                  <ShieldCheck size={13} /> Assigned Role
                </span>
                <span className="role-pill" style={{ display: 'inline-flex', width: 'fit-content' }}>
                  {user.role}
                </span>
              </div>

              <div className="drawer-info-item">
                <span className="drawer-info-label">
                  <Building2 size={13} /> Department
                </span>
                <span className="dept-tag" style={{ display: 'inline-block', width: 'fit-content' }}>
                  {user.department || 'General'}
                </span>
              </div>
            </div>

            {user.bio && (
              <div className="drawer-bio-box">
                <span className="drawer-info-label">Notes & Responsibilities:</span>
                <p className="drawer-bio-text">{user.bio}</p>
              </div>
            )}
          </div>

          {/* Recent Audit Timeline */}
          <div className="drawer-section">
            <h4 className="drawer-section-title">Security & Audit Trail</h4>
            <div className="audit-timeline">
              {mockAuditLogs.map(log => {
                const Icon = log.icon;
                return (
                  <div key={log.id} className="timeline-item">
                    <div className="timeline-icon-wrap">
                      <Icon size={14} />
                    </div>
                    <div className="timeline-content">
                      <p className="timeline-action">{log.action}</p>
                      <span className="timeline-time">{log.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
