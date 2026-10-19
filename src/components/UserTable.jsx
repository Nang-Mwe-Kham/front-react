import React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsUpDown, 
  Eye, 
  Edit3, 
  Trash2, 
  Shield, 
  Power, 
  Mail, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  UserX,
  Clock,
  Search
} from 'lucide-react';

export default function UserTable({
  users,
  allFilteredUsersCount,
  selectedUserIds,
  onToggleSelectUser,
  onToggleSelectAll,
  sortField,
  sortOrder,
  onSort,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onResetFilters
}) {
  const isAllSelected = users.length > 0 && users.every(u => selectedUserIds.includes(u.id));
  const isPartiallySelected = users.some(u => selectedUserIds.includes(u.id)) && !isAllSelected;

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ChevronsUpDown size={14} className="sort-icon-neutral" />;
    }
    return sortOrder === 'asc' 
      ? <ChevronUp size={14} className="sort-icon-active" /> 
      : <ChevronDown size={14} className="sort-icon-active" />;
  };

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

  return (
    <div className="table-card glass-panel">
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={isAllSelected}
                  ref={el => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={onToggleSelectAll}
                  aria-label="Select all users on this page"
                />
              </th>
              <th className="th-sortable" onClick={() => onSort('name')}>
                <div className="th-content">
                  <span>User Details</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th className="th-sortable" onClick={() => onSort('role')}>
                <div className="th-content">
                  <span>Role & Team</span>
                  {renderSortIndicator('role')}
                </div>
              </th>
              <th className="th-sortable" onClick={() => onSort('status')}>
                <div className="th-content">
                  <span>Status</span>
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th className="th-sortable" onClick={() => onSort('joinedDate')}>
                <div className="th-content">
                  <span>Activity / Joined</span>
                  {renderSortIndicator('joinedDate')}
                </div>
              </th>
              <th className="th-actions text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty-row">
                  <div className="empty-state-box">
                    <div className="empty-icon-circle">
                      <Search size={32} />
                    </div>
                    <h3>No matching users found</h3>
                    <p>Try refining your search term or clearing active filters to view results.</p>
                    <button className="btn-secondary" onClick={onResetFilters}>
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <tr 
                    key={user.id} 
                    className={`user-row ${isSelected ? 'row-selected' : ''}`}
                  >
                    <td className="td-checkbox">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectUser(user.id)}
                        aria-label={`Select user ${user.name}`}
                      />
                    </td>
                    <td className="td-user">
                      <div className="user-profile-cell">
                        <div className="avatar-wrapper" onClick={() => onViewUser(user)}>
                          <img 
                            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                            alt={user.name} 
                            className="user-avatar-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                            }}
                          />
                          <span className={`avatar-status-pip status-${user.status?.toLowerCase()}`}></span>
                        </div>
                        <div className="user-names">
                          <button 
                            className="user-name-btn"
                            onClick={() => onViewUser(user)}
                          >
                            {user.name}
                          </button>
                          <div className="user-email-row">
                            <Mail size={12} className="meta-icon" />
                            <span className="user-email">{user.email}</span>
                          </div>
                          {user.location && (
                            <div className="user-location-row">
                              <MapPin size={11} className="meta-icon" />
                              <span className="user-location">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="td-role">
                      <div className="role-dept-stack">
                        <span className="role-pill">
                          <Shield size={12} />
                          {user.role}
                        </span>
                        <span className="dept-tag">
                          {user.department || 'General'}
                        </span>
                      </div>
                    </td>
                    <td className="td-status">
                      <span className={`status-badge ${user.status}`}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </span>
                    </td>
                    <td className="td-date">
                      <div className="date-activity-stack">
                        <span className="date-primary">{user.joinedDate}</span>
                        <span className="date-secondary">{user.lastActive || 'Active recently'}</span>
                      </div>
                    </td>
                    <td className="td-actions">
                      <div className="action-buttons-group">
                        <button
                          className="btn-action view-btn"
                          onClick={() => onViewUser(user)}
                          title="View Full Profile"
                          aria-label={`View ${user.name}`}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-action edit-btn"
                          onClick={() => onEditUser(user)}
                          title="Edit User"
                          aria-label={`Edit ${user.name}`}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className={`btn-action toggle-btn ${user.status === 'Active' ? 'is-active' : ''}`}
                          onClick={() => onToggleStatus(user)}
                          title={user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                          aria-label={`Toggle status for ${user.name}`}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          className="btn-action delete-btn"
                          onClick={() => onDeleteUser(user)}
                          title="Delete User"
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {allFilteredUsersCount > 0 && (
        <div className="table-pagination-bar">
          <div className="pagination-info">
            <span>
              Showing <strong>{Math.min((currentPage - 1) * pageSize + 1, allFilteredUsersCount)}</strong> -{' '}
              <strong>{Math.min(currentPage * pageSize, allFilteredUsersCount)}</strong> of{' '}
              <strong>{allFilteredUsersCount}</strong> users
            </span>
          </div>

          <div className="pagination-controls">
            <div className="page-size-selector">
              <label htmlFor="page-size-select">Per page:</label>
              <select
                id="page-size-select"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="select-page-size"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="pagination-buttons">
              <button
                className="btn-pagination-nav"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                title="Previous Page"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                className="btn-pagination-nav"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                title="Next Page"
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
