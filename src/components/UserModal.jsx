import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Briefcase, 
  Building2, 
  Phone, 
  MapPin, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { ROLES, DEPARTMENTS, STATUS_OPTIONS } from '../data/initialUsers';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
];

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  userToEdit
}) {
  const isEditing = Boolean(userToEdit);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer',
    department: 'Engineering',
    status: 'Active',
    phone: '',
    location: '',
    bio: '',
    avatar: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || '',
        email: userToEdit.email || '',
        role: userToEdit.role || 'Developer',
        department: userToEdit.department || 'Engineering',
        status: userToEdit.status || 'Active',
        phone: userToEdit.phone || '',
        location: userToEdit.location || '',
        bio: userToEdit.bio || '',
        avatar: userToEdit.avatar || ''
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Developer',
        department: 'Engineering',
        status: 'Active',
        phone: '',
        location: 'Remote',
        bio: '',
        avatar: AVATAR_PRESETS[0]
      });
      setErrors({});
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim()
    });
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="modal-container glass-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-text">
            <h3 className="modal-title">
              {isEditing ? 'Edit User Profile' : 'Add New Member'}
            </h3>
            <p className="modal-subtitle">
              {isEditing 
                ? 'Update contact info, role assignments and account permissions.' 
                : 'Invite a new member to the organization workspace.'}
            </p>
          </div>
          <button 
            id="modal-close-btn"
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-avatar-picker">
            <div className="avatar-preview-wrap">
              <img 
                src={formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name || 'User'}`} 
                alt="Selected avatar" 
                className="modal-avatar-preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name || 'User'}`;
                }}
              />
            </div>
            <div className="preset-selector-block">
              <span className="preset-label">Choose Avatar Preset:</span>
              <div className="avatar-presets-row">
                {AVATAR_PRESETS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`preset-thumb-btn ${formData.avatar === presetUrl ? 'preset-active' : ''}`}
                    onClick={() => setFormData({ ...formData, avatar: presetUrl })}
                  >
                    <img src={presetUrl} alt={`Preset ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-grid-two">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="user-fullname">
                Full Name <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <User size={16} className="input-field-icon" />
                <input
                  id="user-fullname"
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="user-email">
                Work Email <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <Mail size={16} className="input-field-icon" />
                <input
                  id="user-email"
                  type="email"
                  placeholder="jane.doe@acmecorp.io"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="user-role-select">Role Assignment</label>
              <div className="input-with-icon">
                <Briefcase size={16} className="input-field-icon" />
                <select
                  id="user-role-select"
                  className="form-input form-select-custom"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="user-dept-select">Department</label>
              <div className="input-with-icon">
                <Building2 size={16} className="input-field-icon" />
                <select
                  id="user-dept-select"
                  className="form-input form-select-custom"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label" htmlFor="user-status-select">Account Status</label>
              <div className="input-with-icon">
                <Shield size={16} className="input-field-icon" />
                <select
                  id="user-status-select"
                  className="form-input form-select-custom"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label" htmlFor="user-phone">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-field-icon" />
                <input
                  id="user-phone"
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" htmlFor="user-location">Location / Office</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-field-icon" />
                <input
                  id="user-location"
                  type="text"
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" htmlFor="user-bio">Bio & Internal Notes</label>
              <textarea
                id="user-bio"
                rows={3}
                placeholder="Key responsibilities, certifications or project involvement..."
                className="form-input form-textarea"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              id="save-user-submit-btn"
              type="submit" 
              className="btn-primary"
            >
              <CheckCircle size={17} />
              <span>{isEditing ? 'Save Changes' : 'Create User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
