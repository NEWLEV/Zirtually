import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../types/database';
import { MOCK_DEPARTMENTS, MOCK_POSITIONS } from '../constants';

export type Department = Database['public']['Tables']['departments']['Row'];
export type Position = Database['public']['Tables']['positions']['Row'];

export type PositionWithDept = Position & { department: { name: string } | null };
export type DepartmentWithManager = Department & { manager: { full_name: string } | null };

type DepartmentInsert = Database['public']['Tables']['departments']['Insert'];
type PositionInsert = Database['public']['Tables']['positions']['Insert'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AdminService = {
  // --- Departments ---
  async getDepartments() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('departments')
        .select('*, manager:manager_id(full_name)')
        .order('name');
      if (error) throw error;
      return data as unknown as DepartmentWithManager[];
    }

    // Mock Fallback
    await delay(300);
    const stored = localStorage.getItem('zirtually_departments');
    return stored ? JSON.parse(stored) : MOCK_DEPARTMENTS;
  },

  async createDepartment(dept: DepartmentInsert) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('departments').insert(dept).select().single();
      if (error) throw error;
      return data;
    }

    // Mock Create
    await delay(300);
    const stored = localStorage.getItem('zirtually_departments');
    const all: Department[] = stored ? JSON.parse(stored) : [...MOCK_DEPARTMENTS];
    const newDept = {
      ...dept,
      id: `dept-${Date.now()}`,
      created_at: new Date().toISOString(),
    } as Department;
    all.push(newDept);
    localStorage.setItem('zirtually_departments', JSON.stringify(all));
    return newDept;
  },

  async updateDepartment(id: string, updates: Partial<Department>) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Mock Update
    await delay(300);
    const stored = localStorage.getItem('zirtually_departments');
    const all: Department[] = stored ? JSON.parse(stored) : [...MOCK_DEPARTMENTS];
    const index = all.findIndex(d => d.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      localStorage.setItem('zirtually_departments', JSON.stringify(all));
      return all[index];
    }
    return null;
  },

  async deleteDepartment(id: string) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    // Mock Delete
    await delay(300);
    const stored = localStorage.getItem('zirtually_departments');
    let all: Department[] = stored ? JSON.parse(stored) : [...MOCK_DEPARTMENTS];
    all = all.filter(d => d.id !== id);
    localStorage.setItem('zirtually_departments', JSON.stringify(all));
  },

  // --- Positions ---
  async getPositions() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('positions')
        .select('*, department:department_id(name)')
        .order('title');
      if (error) throw error;
      return data as unknown as PositionWithDept[];
    }

    // Mock Fallback
    await delay(300);
    const stored = localStorage.getItem('zirtually_positions');
    const positions: Position[] = stored ? JSON.parse(stored) : MOCK_POSITIONS;

    // Simulate join for UI
    const depts = await this.getDepartments();
    return positions.map(p => ({
      ...p,
      department: depts.find((d: DepartmentWithManager) => d.id === p.department_id) || null,
    })) as PositionWithDept[];
  },

  async createPosition(pos: PositionInsert) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('positions').insert(pos).select().single();
      if (error) throw error;
      return data;
    }

    // Mock Create
    await delay(300);
    const stored = localStorage.getItem('zirtually_positions');
    const all: Position[] = stored ? JSON.parse(stored) : [...MOCK_POSITIONS];
    const newPos = {
      ...pos,
      id: `pos-${Date.now()}`,
      created_at: new Date().toISOString(),
    } as Position;
    all.push(newPos);
    localStorage.setItem('zirtually_positions', JSON.stringify(all));
    return newPos;
  },

  async updatePosition(id: string, updates: Partial<Position>) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('positions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Mock Update
    await delay(300);
    const stored = localStorage.getItem('zirtually_positions');
    const all: Position[] = stored ? JSON.parse(stored) : [...MOCK_POSITIONS];
    const index = all.findIndex(p => p.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      localStorage.setItem('zirtually_positions', JSON.stringify(all));
      return all[index];
    }
    return null;
  },

  async deletePosition(id: string) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('positions').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    // Mock Delete
    await delay(300);
    const stored = localStorage.getItem('zirtually_positions');
    let all: Position[] = stored ? JSON.parse(stored) : [...MOCK_POSITIONS];
    all = all.filter(p => p.id !== id);
    localStorage.setItem('zirtually_positions', JSON.stringify(all));
  },
};
