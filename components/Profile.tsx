import React, { useState } from 'react';
import { User } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface ProfileProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    avatarUrl: user.avatarUrl,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUserUpdate({ ...user, ...formData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">User Profile</h2>
      <Card>
        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-dark-border">
          <h3 className="text-xl font-semibold text-brand-dark dark:text-dark-text">My Information</h3>
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="space-x-2">
                <Button variant="secondary" onClick={() => { setIsEditing(false); setFormData({name: user.name, avatarUrl: user.avatarUrl}); }}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
                <img src={formData.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} className="w-40 h-40 rounded-full border-4 border-brand-primary object-cover" />
                {isEditing && (
                     <div className="mt-4">
                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Avatar URL</label>
                        <input
                            type="text"
                            id="avatarUrl"
                            name="avatarUrl"
                            value={formData.avatarUrl}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
                        />
                    </div>
                )}
            </div>
            <div className="flex-grow w-full">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Full Name</label>
                        {isEditing ? (
                             <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-xl bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
                            />
                        ) : (
                            <p className="text-2xl font-semibold mt-1">{user.name}</p>
                        )}
                       
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Email</label>
                        <p className="text-lg text-gray-500 dark:text-dark-text-secondary mt-1">{user.email}</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Role</label>
                        {/* FIX: The component was truncated here. Completed the component and added the default export. */}
                        <p className="text-lg text-gray-500 dark:text-dark-text-secondary mt-1">{user.role}</p>
                    </div>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
