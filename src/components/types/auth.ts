export type UserRole = 'user' | 'admin' | 'super_admin';

export type AuthProvider = 'email' | 'google' | 'github';

export interface UserProfile {
  avatar_url?: string;
  full_name?: string;
  organization?: {
    id: string;
    name: string;
    role: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  email_verified: boolean;
  last_sign_in?: string;
  provider?: AuthProvider;
  profile?: UserProfile;
  lastSignInAt?: string;
  emailVerified?: boolean;
}

export interface AuthError {
  message: string;
  status: number;
  code?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  full_name?: string;
  organization_name?: string;
}

export type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Helper type guards
export const isUserRole = (role: unknown): role is UserRole => {
  return typeof role === 'string' && ['user', 'admin', 'super_admin'].includes(role as UserRole);
};

export const hasRequiredUserFields = (user: unknown): user is User => {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'email' in user &&
    'role' in user &&
    typeof (user as Record<string, unknown>).id === 'string' &&
    typeof (user as Record<string, unknown>).email === 'string' &&
    isUserRole((user as Record<string, unknown>).role)
  );
};

export interface UserData {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  status: string;
  email_verified: boolean;
  last_sign_in_at?: string;
  role: UserRole;
  provider?: AuthProvider;
  profile?: UserProfile;
  organization?: {
    id: string;
    name: string;
    role: string;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  }; // Removed the duplicated user data fields from preferences
}

export interface UserTableProps {
  users: UserData[];
  onUpdateRole: (userId: string, role: string) => Promise<void>;
  onUpdateStatus: (userId: string, status: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  showEmpty: string;
}



export interface DashboardHeaderProps {
  userData: UserData | null;
  userRole: UserRole;
  pathname: string;
  onLogout: () => Promise<void>;
  toggleSidebar: () => void;
}

export interface DashboardNavProps {
  userData: UserData | null;
  pathname: string;
  userRole: UserRole;
  onLogout: () => Promise<void>;
  isOpen: boolean;
}
export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

