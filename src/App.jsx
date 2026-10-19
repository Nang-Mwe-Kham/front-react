import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import UserTable from './components/UserTable';
import UserGrid from './components/UserGrid';
import UserModal from './components/UserModal';
import UserDetailsDrawer from './components/UserDetailsDrawer';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { INITIAL_USERS } from './data/initialUsers';
import { 
  fetchUsersApi, 
  createUserApi, 
  updateUserApi, 
  deleteUserApi, 
  bulkUsersApi, 
  resetSeedApi 
} from './services/api';
import { RotateCcw } from 'lucide-react';
import './App.css';

const LOCAL_STORAGE_KEY = 'userhub_directory_users';
const THEME_STORAGE_KEY = 'userhub_theme_preference';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  // Backend API connection state
  const [apiConnected, setApiConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Users State
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading localStorage users:', e);
    }
    return INITIAL_USERS;
  });

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Synchronize document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Load users from Next.js API
  const loadUsersFromApi = useCallback(async (quiet = false) => {
    setIsRefreshing(true);
    try {
      const backendUsers = await fetchUsersApi();
      if (Array.isArray(backendUsers) && backendUsers.length > 0) {
        setUsers(backendUsers);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(backendUsers));
        setApiConnected(true);
        if (!quiet) showToast('Synced with Next.js API');
      }
    } catch (error) {
      console.warn('Next.js API offline, continuing with local store:', error.message);
      setApiConnected(false);
      if (!quiet) showToast('Using local directory mode', 'info');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadUsersFromApi(true);
  }, [loadUsersFromApi]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // View Mode: 'table' | 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Sorting state
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Multi-selection state
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Modals & Drawer states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const searchInputRef = useRef(null);

  // Global Keyboard shortcut: Command/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered and Sorted Users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesName = user.name?.toLowerCase().includes(query);
        const matchesEmail = user.email?.toLowerCase().includes(query);
        const matchesRole = user.role?.toLowerCase().includes(query);
        const matchesDept = user.department?.toLowerCase().includes(query);
        const matchesLoc = user.location?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesRole && !matchesDept && !matchesLoc) {
          return false;
        }
      }

      // Department match
      if (selectedDepartment !== 'ALL' && user.department !== selectedDepartment) {
        return false;
      }

      // Role match
      if (selectedRole !== 'ALL' && user.role !== selectedRole) {
        return false;
      }

      // Status match
      if (selectedStatus !== 'ALL' && user.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, searchQuery, selectedDepartment, selectedRole, selectedStatus, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  // Reset to page 1 when filters or query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, selectedRole, selectedStatus, pageSize]);

  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIdx, startIdx + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Sort toggle handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Selection handlers
  const handleToggleSelectUser = (id) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = paginatedUsers.map(u => u.id);
    const allCurrentSelected = currentPageIds.every(id => selectedUserIds.includes(id));

    if (allCurrentSelected) {
      setSelectedUserIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedUserIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
  };

  // Bulk actions
  const handleBulkStatusChange = async (newStatus) => {
    try {
      await bulkUsersApi('status', selectedUserIds, newStatus);
      setApiConnected(true);
    } catch (e) {
      console.warn('API error, falling back locally:', e.message);
    }

    setUsers(prev => {
      const updated = prev.map(u => selectedUserIds.includes(u.id) ? { ...u, status: newStatus } : u);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    showToast(`Updated status to "${newStatus}" for ${selectedUserIds.length} users`);
    setSelectedUserIds([]);
  };

  const handleOpenBulkDelete = () => {
    setIsBulkDelete(true);
    setUserToDelete(null);
    setIsDeleteModalOpen(true);
  };

  // User actions
  const handleOpenAddModal = () => {
    setUserToEdit(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setIsBulkDelete(false);
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleViewUser = (user) => {
    setSelectedUserForDrawer(user);
    setIsDrawerOpen(true);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateUserApi(user.id, { status: newStatus });
      setApiConnected(true);
    } catch (e) {
      console.warn('API update failed, updating locally:', e.message);
    }

    setUsers(prev => {
      const updated = prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    showToast(`${user.name} is now ${newStatus}`);
    if (selectedUserForDrawer && selectedUserForDrawer.id === user.id) {
      setSelectedUserForDrawer(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveUser = async (userData) => {
    if (userToEdit) {
      // Update existing
      try {
        const saved = await updateUserApi(userToEdit.id, userData);
        setUsers(prev => {
          const updated = prev.map(u => u.id === userToEdit.id ? { ...u, ...saved } : u);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        setApiConnected(true);
      } catch (e) {
        setUsers(prev => {
          const updated = prev.map(u => u.id === userToEdit.id ? { ...u, ...userData } : u);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }

      showToast(`Updated profile for ${userData.name}`);
      if (selectedUserForDrawer && selectedUserForDrawer.id === userToEdit.id) {
        setSelectedUserForDrawer(prev => ({ ...prev, ...userData }));
      }
    } else {
      // Create new
      try {
        const created = await createUserApi(userData);
        setUsers(prev => {
          const updated = [created, ...prev];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        setApiConnected(true);
      } catch (e) {
        const localUser = {
          ...userData,
          id: `usr_${Date.now()}`,
          joinedDate: new Date().toISOString().split('T')[0],
          lastActive: 'Just now'
        };
        setUsers(prev => {
          const updated = [localUser, ...prev];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }

      showToast(`Added ${userData.name} to directory`);
    }
    setIsUserModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      try {
        await bulkUsersApi('delete', selectedUserIds);
        setApiConnected(true);
      } catch (e) {
        console.warn('API bulk delete failed:', e.message);
      }

      setUsers(prev => {
        const updated = prev.filter(u => !selectedUserIds.includes(u.id));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      showToast(`Deleted ${selectedUserIds.length} users successfully`, 'info');
      setSelectedUserIds([]);
    } else if (userToDelete) {
      try {
        await deleteUserApi(userToDelete.id);
        setApiConnected(true);
      } catch (e) {
        console.warn('API delete failed:', e.message);
      }

      setUsers(prev => {
        const updated = prev.filter(u => u.id !== userToDelete.id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      setSelectedUserIds(prev => prev.filter(id => id !== userToDelete.id));
      showToast(`User ${userToDelete.name} has been removed`, 'info');
      if (selectedUserForDrawer && selectedUserForDrawer.id === userToDelete.id) {
        setIsDrawerOpen(false);
      }
    }
    setIsDeleteModalOpen(false);
  };

  // Reset demo seed data
  const handleResetToSeedData = async () => {
    try {
      const seeded = await resetSeedApi();
      setUsers(seeded);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seeded));
      setApiConnected(true);
    } catch (e) {
      setUsers(INITIAL_USERS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    }
    setSelectedUserIds([]);
    handleResetFilters();
    showToast('Directory reset to default demo records', 'info');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('ALL');
    setSelectedRole('ALL');
    setSelectedStatus('ALL');
  };

  const hasActiveFilters = searchQuery !== '' || selectedDepartment !== 'ALL' || selectedRole !== 'ALL' || selectedStatus !== 'ALL';

  // Export CSV
  const handleExportCsv = () => {
    if (filteredUsers.length === 0) {
      showToast('No users match current filters to export', 'error');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'Joined Date', 'Phone', 'Location'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.department || ''}"`,
      `"${u.status}"`,
      `"${u.joinedDate}"`,
      `"${u.phone || ''}"`,
      `"${u.location || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `userhub-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredUsers.length} records to CSV`);
  };

  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <Navbar 
        theme={theme}
        onToggleTheme={toggleTheme}
        totalCount={users.filter(u => u.status === 'Active').length}
        onSearchFocus={() => searchInputRef.current?.focus()}
        apiConnected={apiConnected}
        isRefreshing={isRefreshing}
        onRefreshData={() => loadUsersFromApi(false)}
      />

      <main className="main-content">
        {/* Page Hero Header */}
        <section className="page-header-section">
          <div className="page-header-text">
            <h1 className="page-title">User Management</h1>
            <p className="page-description">
              Manage member roles, permissions, directory access, and organization identity.
            </p>
          </div>

          <div className="page-header-extra">
            <button 
              id="reset-demo-data-btn"
              className="btn-secondary btn-sm" 
              onClick={handleResetToSeedData}
              title="Reset data to initial state"
            >
              <RotateCcw size={14} />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </section>

        {/* 4 Metric Stats Cards */}
        <StatsCards users={users} />

        {/* Controls, Filters & Bulk Actions */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAddModal={handleOpenAddModal}
          onExportCsv={handleExportCsv}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          selectedUserIds={selectedUserIds}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkDelete={handleOpenBulkDelete}
          onClearSelection={handleClearSelection}
        />

        {/* User Content: Table View or Grid View */}
        {viewMode === 'table' ? (
          <UserTable
            users={paginatedUsers}
            allFilteredUsersCount={filteredUsers.length}
            selectedUserIds={selectedUserIds}
            onToggleSelectUser={handleToggleSelectUser}
            onToggleSelectAll={handleToggleSelectAll}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onViewUser={handleViewUser}
            onEditUser={handleOpenEditModal}
            onDeleteUser={handleOpenDeleteModal}
            onToggleStatus={handleToggleStatus}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <UserGrid
            users={filteredUsers}
            selectedUserIds={selectedUserIds}
            onToggleSelectUser={handleToggleSelectUser}
            onViewUser={handleViewUser}
            onEditUser={handleOpenEditModal}
            onDeleteUser={handleOpenDeleteModal}
            onToggleStatus={handleToggleStatus}
            onResetFilters={handleResetFilters}
          />
        )}
      </main>

      {/* Add / Edit User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleSaveUser}
        userToEdit={userToEdit}
      />

      {/* Slide-out User Profile Drawer */}
      <UserDetailsDrawer
        user={selectedUserForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name}
        count={isBulkDelete ? selectedUserIds.length : 1}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
