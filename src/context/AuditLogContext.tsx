import React, { createContext, useContext, useCallback, ReactNode, useState, useEffect } from 'react';
import { User, AuditLog } from '../types';
import { AuditLogService } from '../services/auditLogService';

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
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Load logs on mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchedLogs = await AuditLogService.getLogs();
        setLogs(fetchedLogs);
      } catch (err) {
        console.error('Failed to load audit logs', err);
      }
    };
    fetchLogs();
  }, []);

  const logAction = useCallback(
    async (
      user: User | { id: string; name: string },
      action: string,
      category: AuditLog['category'],
      details: string,
      status: AuditLog['status'] = 'success',
      affectedEntity?: string
    ) => {
      try {
        const newLog = await AuditLogService.createLog(
          user,
          action,
          category,
          details,
          status,
          affectedEntity
        );
        // Prepend the new log to the state
        setLogs(prev => [newLog, ...prev]);
      } catch (error) {
        console.error('Failed to log action:', error);
      }
    },
    []
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

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
