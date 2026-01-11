import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, UserRole, ManagedDocument } from '../types';
import { MOCK_DOCUMENTS, createAuditLog } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface DocumentManagementProps {
  user: User;
}

const StatusBadge: React.FC<{ status: ManagedDocument['status'] }> = ({ status }) => {
    const statusClasses = {
        'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Draft': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const DocumentManagement: React.FC<DocumentManagementProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ManagedDocument | null>(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredDocuments = useMemo(() => {
    return MOCK_DOCUMENTS.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSummarize = async (doc: ManagedDocument) => {
    setSelectedDoc(doc);
    setSummary('');
    setIsLoading(true);
    setIsModalOpen(true);
    createAuditLog(user, 'VIEW_DOCUMENT_SUMMARY', `Generated AI summary for document: ${doc.name}`);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze the following document's content purely for operational insights. Do NOT include any person names, patient details, or sensitive data in the summary. Your output should focus on suggesting workflow improvements, identifying potential process bottlenecks, or highlighting key operational procedures mentioned. For example, if the document is a procedure, summarize the steps. If it's a policy, summarize the key rules for staff.\n\n---\n\n${doc.content}`
      });
      setSummary(response.text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setSummary("Sorry, an error occurred while generating the summary. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoc(null);
    setSummary('');
  }

  if (![UserRole.MANAGER, UserRole.ADMIN].includes(user.role)) {
    return (
      <Card title="Access Denied">
        <p>The Document Management module is only available to users with Manager or Admin roles.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Document Management</h2>
      <Card>
        <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-dark-border">
          <div>
            <h3 className="text-xl font-semibold text-brand-dark dark:text-dark-text">Document Library</h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Search, view, and analyze practice documents.</p>
          </div>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search by name or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
              aria-label="Search documents"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Document Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Version</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Last Updated</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-card dark:divide-dark-border">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{doc.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{doc.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="secondary" onClick={() => alert('Viewing document content directly. In a real app, this would open a secure document viewer.')}>View</Button>
                    <Button variant="primary" onClick={() => handleSummarize(doc)}>AI Summarize</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {filteredDocuments.length === 0 && (
              <div className="text-center py-10 text-gray-500 dark:text-dark-text-secondary">
                  <p>No documents found matching your search.</p>
              </div>
            )}
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} title={`AI Summary: ${selectedDoc?.name || ''}`}>
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-dark-text-secondary">Generating summary with Gemini...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto rounded-md border bg-gray-50 p-4 dark:bg-gray-800 dark:border-dark-border">
               {summary.split('\n').map((paragraph, index) => {
                 if (paragraph.startsWith('*')) {
                   return <li key={index} className="ml-4">{paragraph.substring(1).trim()}</li>;
                 }
                 return <p key={index}>{paragraph}</p>;
               })}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t dark:border-dark-border">
              <p>This summary was generated by AI and must not contain PHI. Always refer to the original document for official information.</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={closeModal}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DocumentManagement;
