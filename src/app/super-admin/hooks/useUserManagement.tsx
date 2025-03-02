import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import supabase from '@/lib/supabase';
import type { UserData, UserRole } from '@/components/types/auth';


export default function useUserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch users function
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      // Transform data to match UserData interface
      const transformedData: UserData[] = data?.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        email_verified: user.email_verified || false,
        status: user.status || 'active'
      })) || [];
      
      setUsers(transformedData);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Update user role
  const updateUserRole = useCallback(async (userId: string, role: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: role as UserRole } : user
      ));
      
      const successMessage = `User role updated to ${role}`;
      setSuccess(successMessage);
      toast.success(successMessage);
    } catch (err) {
      console.error('Error updating user role:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update user status
  const updateUserStatus = useCallback(async (userId: string, status: "active" | "pending" | "suspended") => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      
      const successMessage = `User status updated to ${status}`;
      setSuccess(successMessage);
      toast.success(successMessage);
    } catch (err) {
      console.error('Error updating user status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user status';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Delete user
  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      const successMessage = 'User deleted successfully';
      setSuccess(successMessage);
      toast.success(successMessage);
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Add new user
  const addUser = useCallback(async (userData: { email: string; role: string; }) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...userData,
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      if (data && data.length > 0) {
        setUsers(prev => [data[0], ...prev]);
      }
      
      const successMessage = 'User added successfully';
      setSuccess(successMessage);
      toast.success(successMessage);
      return true;
    } catch (err) {
      console.error('Error adding user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add user';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Refresh users (alias for fetchUsers for clearer API)
  const refreshUsers = fetchUsers;
  
  return {
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
    addUser
  };
}