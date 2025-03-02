"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

interface UserSettings {
  id: string;
  email: string;
  role: 'user' | 'admin';
  notification_preferences: {
    email_notifications: boolean;
    survey_reminders: boolean;
    marketing_emails: boolean;
  };
  display_preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  organization?: {
    name: string;
    role: string;
  };
}

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'admin'>('profile');

  useEffect(() => {
    async function fetchUserSettings() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    fetchUserSettings();
  }, [router]);

  const handleSaveSettings = async (updatedSettings: Partial<UserSettings>) => {
    setSaving(true);
    setError(null); // Reset error state
    try {
      const { error: saveError } = await supabase
        .from('users')
        .update(updatedSettings)
        .eq('id', settings?.id);

      if (saveError) throw saveError;
      setSettings(prev => ({ ...prev!, ...updatedSettings }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Show error message if present */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['profile', 'notifications', 'security', ...(settings?.role === 'admin' ? ['admin'] : [])]
            .map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-itg-red text-itg-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
              <p className="mt-1 text-sm text-gray-500">Update your personal information</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={settings?.email}
                  disabled
                  aria-label="Email address"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <p className="mt-1 text-sm text-gray-500">Your email cannot be changed</p>
              </div>

              {settings?.role === 'admin' && (
                <div>
                  <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <input
                    id="orgName"
                    type="text"
                    value={settings.organization?.name || ''}
                    onChange={(e) => handleSaveSettings({
                      organization: { ...settings.organization!, name: e.target.value }
                    })}
                    aria-label="Organization name"
                    placeholder="Enter organization name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
              <p className="mt-1 text-sm text-gray-500">Manage how you receive notifications</p>
            </div>
<div className="space-y-4">
  {Object.entries(settings?.notification_preferences ?? {}).map(([key, value]) => (
    <div key={key} className="flex items-center justify-between">
      <label htmlFor={`notification-${key}`} className="text-sm font-medium text-gray-700">
        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </label>
      <input
        id={`notification-${key}`}
        type="checkbox"
        checked={value}
        onChange={(e) => {
          if (settings?.notification_preferences) {
            handleSaveSettings({
              notification_preferences: {
                ...settings.notification_preferences,
                [key]: e.target.checked
              }
            });
          }
        }}
        aria-label={`Toggle ${key.split('_').join(' ')}`}
        className="h-4 w-4 text-itg-red focus:ring-itg-red border-gray-300 rounded"
      />
    </div>
  ))}
</div>

            {/* Show saving indicator */}
            {saving && (
              <div className="flex items-center justify-end text-sm text-gray-500">
                <LoadingSpinner size="small" />
                <span className="ml-2">Saving changes...</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your account security</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/auth/reset-password')}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Change Password
              </button>
            </div>
          </div>
        )}

        {activeTab === 'admin' && settings?.role === 'admin' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Admin Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Manage system-wide settings</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Survey Templates</h4>
                <p className="mt-1 text-sm text-gray-500">Manage default survey templates</p>
                {/* Add survey template management UI */}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">User Management</h4>
                <p className="mt-1 text-sm text-gray-500">Manage user roles and permissions</p>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Manage Users
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900">System Settings</h4>
                <p className="mt-1 text-sm text-gray-500">Configure system-wide settings</p>
                {/* Add system settings UI */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}