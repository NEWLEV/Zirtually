import { useAuthContext } from '../context/AuthContext';
import { User } from '../types';

// Adapting the new context to the old hook signature for minimal refactor friction first
export const useAuth = () => {
  const { user, users, login, logout, updateUser } = useAuthContext();

  // Adapter to match the old signature where login took a full User object
  // The old App.tsx passed a User object to login.
  // We need to bridge this gap until we update the Login component.
  const loginAdapter = async (userOrCreds: User | { email: string; password?: string }) => {
    // If it's the new credentials object with a password
    if ('password' in userOrCreds && userOrCreds.password) {
      return login(userOrCreds as { email: string; password?: string });
    }
    // If it's a User object or email-only (mock picker)
    if ('email' in userOrCreds && userOrCreds.email) {
      return login({ email: userOrCreds.email });
    }

    throw new Error('Invalid login credentials provided');
  };

  return {
    users, // Kept for the Profile Picker
    currentUser: user, // Renamed to match old hook
    login: loginAdapter,
    logout,
    updateUser,
  };
};
