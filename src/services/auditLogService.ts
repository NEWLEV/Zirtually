import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../types/database';
import { AuditLog, User } from '../types';
import { MOCK_AUDIT_LOGS } from '../constants';

type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AuditLogService = {
    /**
     * Fetch all audit logs
     */
    getLogs: async (): Promise<AuditLog[]> => {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*, profiles:user_id(full_name)')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching audit logs:', error);
                return [];
            }

            // Transform DB rows to AuditLog objects
            return data.map((row: any) => ({
                id: row.id,
                timestamp: row.created_at,
                user: {
                    id: row.user_id,
                    name: row.profiles?.full_name || 'Unknown',
                },
                action: row.action,
                category: row.category as AuditLog['category'],
                details: row.details,
                status: row.status as AuditLog['status'],
                ipAddress: row.ip_address || undefined,
                affectedEntity: row.affected_entity || undefined,
            }));
        }

        // Mock Fallback
        await delay(300);
        const stored = localStorage.getItem('zirtually_audit_logs');
        return stored ? JSON.parse(stored) : MOCK_AUDIT_LOGS;
    },

    /**
     * Create a new audit log entry
     */
    createLog: async (
        user: User | { id: string; name: string },
        action: string,
        category: AuditLog['category'],
        details: string,
        status: AuditLog['status'] = 'success',
        affectedEntity?: string
    ): Promise<AuditLog> => {
        const timestamp = new Date().toISOString();

        // Construct the object first for consistent return
        const newLog: AuditLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp,
            user: { id: user.id, name: user.name },
            action,
            category,
            details,
            status,
            affectedEntity,
            ipAddress: '127.0.0.1', // Simulated for now
        };

        if (isSupabaseConfigured()) {
            const dbLog: AuditLogInsert = {
                user_id: user.id,
                action,
                category,
                details,
                status,
                affected_entity: affectedEntity,
                ip_address: newLog.ipAddress,
                created_at: timestamp,
            };

            const { data, error } = await supabase.from('audit_logs').insert(dbLog).select('*, profiles:user_id(full_name)').single();

            if (error) {
                console.error('Error creating audit log:', error);
                // Return the optimistic log in case of error, or throw? 
                // For audit logs, maybe we don't want to break the app if logging fails, 
                // so we log the error and return the local object.
            } else if (data) {
                // Return the object with the real ID from DB
                return {
                    ...newLog,
                    id: data.id,
                    timestamp: data.created_at
                };
            }
        }

        // Mock Mode: Persist to LocalStorage
        await delay(100);
        const stored = localStorage.getItem('zirtually_audit_logs');
        const logs = stored ? JSON.parse(stored) : [...MOCK_AUDIT_LOGS];
        logs.unshift(newLog); // User actions usually go on top
        localStorage.setItem('zirtually_audit_logs', JSON.stringify(logs));

        return newLog;
    },
};
