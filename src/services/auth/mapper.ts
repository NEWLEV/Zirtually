import { User, UserRole } from '../../types';
import { Database } from '../../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function mapProfileToUser(profile: Profile): User {
  return {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: mapSupabaseRoleToAppRole(profile.role),
    avatarUrl:
      profile.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`,
    isNewHire: false, // Default or fetch from somewhere
    department: profile.department,
    // Other fields can be filled with defaults or extended in the DB schema later
  };
}

function mapSupabaseRoleToAppRole(role: string): UserRole {
  switch (role.toLowerCase()) {
    case 'admin':
      return UserRole.ADMIN;
    case 'manager':
      return UserRole.MANAGER;
    case 'executive':
      return UserRole.EXECUTIVE;
    default:
      return UserRole.STAFF;
  }
}

export function mapAppRoleToSupabaseRole(role: UserRole): 'admin' | 'manager' | 'employee' {
  switch (role) {
    case UserRole.ADMIN:
      return 'admin';
    case UserRole.MANAGER:
      return 'manager';
    case UserRole.EXECUTIVE:
      return 'admin'; // Mapping executive to admin for now in DB roles
    default:
      return 'employee';
  }
}
