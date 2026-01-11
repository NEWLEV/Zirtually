import React from 'react';
import { User, Credential as CredentialType, CredentialStatus } from '../types';
import { MOCK_CREDENTIALS } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';

interface CredentialingProps {
  user: User;
}

const StatusBadge: React.FC<{ status: CredentialStatus }> = ({ status }) => {
    const statusClasses = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Expiring Soon': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Expired': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const Credentialing: React.FC<CredentialingProps> = ({ user }) => {
    // In a real app, this would be filtered to the current user
    const userCredentials = MOCK_CREDENTIALS;

    const getDaysUntilExpiry = (expiryDate: string) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Credentialing & Compliance</h2>

            {userCredentials.some(c => c.status !== 'Active') && (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-600">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.273-1.21 2.91 0l5.396 10.27c.631 1.205-.285 2.63-1.63 2.63H4.49C3.144 16 2.228 14.574 2.86 13.37l5.396-10.27zM9 8a1 1 0 011-1h.01a1 1 0 010 2H10a1 1 0 01-1-1zm1 2a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                <span className="font-bold">Action Required:</span> You have credentials that are expired or expiring soon. Please take action to ensure compliance.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Card>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-brand-dark dark:text-dark-text">My Credentials</h3>
                    <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Manage your professional licenses and certifications.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Credential Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Expiration Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Credential ID</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                        {userCredentials.map((cred) => {
                            const daysUntilExpiry = getDaysUntilExpiry(cred.expiryDate);
                            return (
                                <tr key={cred.id} className={cred.status !== 'Active' ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{cred.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={cred.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-dark-text">{new Date(cred.expiryDate).toLocaleDateString()}</span>
                                            {cred.status === 'Expiring Soon' && <span className="text-yellow-700 dark:text-yellow-400 text-xs">({daysUntilExpiry} days left)</span>}
                                            {cred.status === 'Expired' && <span className="text-red-700 dark:text-red-400 text-xs">(Expired)</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{cred.credentialId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button variant="secondary">Upload Document</Button>
                                        <Button variant="primary">Start Renewal</Button>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Credentialing;