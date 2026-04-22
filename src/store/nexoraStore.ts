/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, Semester } from '../services/cgpaEngine';

interface UserProfile {
  fullName: string;
  collegeName: string;
  branch: string;
  currentSemester: number;
  totalCreditsPerSemester: number;
  gradingScale: '10-point' | 'percentage';
  universityName: string;
}

interface ProjectProfile {
  title: string;
  teamSize: number;
  domain: string;
  hardware: string;
  startMonth: string;
  deadlineMonth: string;
  milestones: any[];
}

interface NexoraState {
  user: any | null;
  profile: UserProfile | null;
  project: ProjectProfile | null;
  semesters: Semester[];
  currentSemesterSubjects: Subject[];
  
  setUser: (user: any) => void;
  setProfile: (profile: UserProfile) => void;
  setProject: (project: ProjectProfile) => void;
  setSemesters: (semesters: Semester[]) => void;
  setCurrentSemesterSubjects: (subjects: Subject[]) => void;
  updateSubjectMarks: (subjectId: string, internal: number, external?: number) => void;
  clearAll: () => void;
}

export const useNexoraStore = create<NexoraState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      project: null,
      semesters: [],
      currentSemesterSubjects: [],

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setProject: (project) => set({ project }),
      setSemesters: (semesters) => set({ semesters }),
      setCurrentSemesterSubjects: (subjects) => set({ currentSemesterSubjects: subjects }),
      
      updateSubjectMarks: (subjectId, internal, external) => set((state) => ({
        currentSemesterSubjects: state.currentSemesterSubjects.map(s => 
          s.id === subjectId ? { ...s, internalScore: internal, externalScore: external } : s
        )
      })),

      clearAll: () => set({ user: null, profile: null, project: null, semesters: [], currentSemesterSubjects: [] }),
    }),
    {
      name: 'nexora-storage',
    }
  )
);
