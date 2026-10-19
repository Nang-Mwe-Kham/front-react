import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  LayoutList, 
  LayoutGrid, 
  Download, 
  UserPlus, 
  CheckSquare, 
  Trash2, 
  UserCheck, 
  UserX,
  RotateCcw
} from 'lucide-react';
import { DEPARTMENTS, ROLES, STATUS_OPTIONS } from '../data/initialUsers';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  searchInputRef,
  selectedDepartment,
  onDepartmentChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onExportCsv,
  onResetFilters,
  hasActiveFilters,
  selectedUserIds,
  onBulkStatusChange,
  onBulkDelete,
  onClearSelection
}) {
  return (
    <div className="filter-bar-wrapper">
      {/* Top Filter Controls */}
      <div className="filter-controls-row glass-panel">
        <div className="filter-search-box">
          <Search size={18} className="search-input-icon" />
          <input
            id="user-search-input"
            ref={searchInputRef}
            type="text"
            className="filter-search-input"
            placeholder="Search by name, email, department or role..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          {/* Department Filter */}
          <div className="select-wrapper">
            <select
              id="filter-department-select"
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="select-wrapper">
            <select
              id="filter-role-select"
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Roles</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="select-wrapper">
            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button 
              id="reset-filters-btn"
              className="btn-secondary btn-icon-only" 
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={16} />
              <span className="btn-label-desktop">Reset</span>
            </button>
          )}
        </div>

        {/* View mode toggle & Action Buttons */}
        <div className="filter-actions">
          <div className="view-mode-toggle">
            <button
              id="view-mode-table-btn"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
              aria-label="Table View"
            >
              <LayoutList size={18} />
            </button>
            <button
              id="view-mode-grid-btn"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button 
            id="export-csv-btn"
            className="btn-secondary" 
            onClick={onExportCsv}
            title="Export filtered directory to CSV"
          >
            <Download size={16} />
            <span className="btn-label-desktop">Export CSV</span>
          </button>

          <button 
            id="add-user-modal-btn"
            className="btn-primary" 
            onClick={onOpenAddModal}
          >
            <UserPlus size={17} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Floating Bulk Actions Bar when items selected */}
      {selectedUserIds.length > 0 && (
        <div className="bulk-actions-bar animate-fade-in">
          <div className="bulk-info">
            <CheckSquare size={18} className="bulk-check-icon" />
            <span className="bulk-count">
              <strong>{selectedUserIds.length}</strong> {selectedUserIds.length === 1 ? 'user' : 'users'} selected
            </span>
          </div>

          <div className="bulk-buttons">
            <button 
              className="btn-bulk btn-bulk-active"
              onClick={() => onBulkStatusChange('Active')}
            >
              <UserCheck size={15} />
              Set Active
            </button>

            <button 
              className="btn-bulk btn-bulk-suspend"
              onClick={() => onBulkStatusChange('Suspended')}
            >
              <UserX size={15} />
              Set Suspended
            </button>

            <button 
              className="btn-bulk btn-bulk-delete"
              onClick={onBulkDelete}
            >
              <Trash2 size={15} />
              Delete Selected
            </button>

            <button 
              className="btn-bulk-cancel" 
              onClick={onClearSelection}
            >
              Deselect All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
