"use client";

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import SuperAdminNav from '@/components/SuperAdminNav';
import Header from '@/components/Header';
import AddUserModal from './components/AddUserModal';
import StatsGrid from './components/StatsGrid';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import useUserManagement from './hooks/useUserManagement';

export default function SuperAdminDashboard() {
  console.log('[SuperAdmin] Component rendering started');
  
  const {
    users,
    loading,
    error,
    success,
    setError,
    setSuccess,
    refreshUsers,
    updateUserRole,
    updateUserStatus,
    deleteUser,
  } = useUserManagement();
  
  const [showAddUser, setShowAddUser] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log('[SuperAdmin] State update - users:', users.length, 'loading:', loading);
  }, [users, loading]);

  // Debug effect to check authentication
  useEffect(() => {
    async function checkAuth() {
      console.log('[SuperAdmin] Checking authentication state...');
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[SuperAdmin] Authentication error:', error);
          return;
        }
        
        if (data.session) {
          console.log('[SuperAdmin] Authenticated as:', data.session.user.email);
          
          // Check user role
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, email')
            .eq('id', data.session.user.id)
            .single();
            
          if (userError) {
            console.error('[SuperAdmin] Error fetching user data:', userError);
            return;
          }
          
          console.log('[SuperAdmin] User role:', userData?.role);
        } else {
          console.log('[SuperAdmin] No active session found');
        }
      } catch (err) {
        console.error('[SuperAdmin] Authentication check error:', err);
      }
    }
    
    checkAuth();
  }, []);

  // Filter users based on criteria
  const filteredUsers = users.filter(user => {
    // Filter by role
    if (filter !== 'all' && user.role !== filter) {
      return false;
    }
    
    // Filter by search term
    if (search && !user.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  console.log('[SuperAdmin] Rendering with loading:', loading, 'users:', users.length);

  if (loading && users.length === 0) {
    console.log('[SuperAdmin] Showing loading spinner');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="mt-3 text-gray-600">Loading super admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('[SuperAdmin] Rendering full dashboard');
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <SuperAdminNav />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all users and system settings
              </p>
            </div>
            
            {/* Alerts */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
                <button 
                  className="ml-auto text-red-700 hover:text-red-900"
                  onClick={() => setError(null)}
                  title="Close error message"
                  aria-label="Close error message"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
                <button 
                  className="ml-auto text-green-700 hover:text-green-900"
                  onClick={() => setSuccess(null)}
                  title="Close success message"
                  aria-label="Close success message"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Stats Grid Component */}
            <StatsGrid users={users} />
            
            {/* Controls & Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                  <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                  
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                    {/* User Filters Component */}
                    <UserFilters 
                      search={search}
                      setSearch={setSearch}
                      filter={filter}
                      setFilter={setFilter}
                      refreshUsers={refreshUsers}
                      onAddUser={() => setShowAddUser(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Users Table Component */}
              {loading && users.length > 0 ? (
                <div className="p-4 flex justify-center">
                  <LoadingSpinner size="small" />
                </div>
              ) : (
                <UserTable
                  users={filteredUsers}
                  onUpdateRole={updateUserRole}
                  onUpdateStatus={updateUserStatus}
                  onDeleteUser={deleteUser}
                  showEmpty={search || filter !== 'all' 
                    ? "No users match your search criteria" 
                    : "No users found in the system"
                  }
                  loading={loading}
                  onAction={() => {}} // Add implementation based on your needs
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal Component */}
      {showAddUser && (
        <AddUserModal
          show={showAddUser}
          onClose={() => setShowAddUser(false)}
          onUserAdded={() => {
            setShowAddUser(false);
            refreshUsers();
          }}
          onSubmit={async () => {}}
          isLoading={false}
        />
      )}
    </div>
  );
}