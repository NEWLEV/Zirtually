import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { User, AuditLog } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { MOCK_AUDIT_LOGS } from '../constants';

interface AuditLogContextType {
  logs: AuditLog[];
  logAction: (
    user: User | { id: string; name: string },
    action: string,
    category: AuditLog['category'],
    details: string,
    status?: AuditLog['status'],
    affectedEntity?: string
  ) => void;
  clearLogs: () => void;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const AuditLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useLocalStorage<AuditLog[]>('zirtually_audit_logs', MOCK_AUDIT_LOGS);

  const logAction = useCallback(
    (
      user: User | { id: string; name: string },
      action: string,
      category: AuditLog['category'],
      details: string,
      status: AuditLog['status'] = 'success',
      affectedEntity?: string
    ) => {
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        user: { id: user.id, name: user.name },
        action,
        category,
        details,
        status,
        affectedEntity,
        ipAddress: '127.0.0.1', // Simulated
      };
      setLogs(prev => [newLog, ...prev]);
    },
    [setLogs]
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  return (
    <AuditLogContext.Provider value={{ logs, logAction, clearLogs }}>
      {children}
    </AuditLogContext.Provider>
  );
};

export const useAuditLogs = () => {
  const context = useContext(AuditLogContext);
  if (context === undefined) {
    throw new Error('useAuditLogs must be used within an AuditLogProvider');
  }
  return context;
};
