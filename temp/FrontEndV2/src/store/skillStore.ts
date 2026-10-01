import { create } from 'zustand';

interface SkillState {
  skills: any[];
  activeSkill: string | null;
  setSkills: (skills: any[]) => void;
  setActiveSkill: (skillId: string | null) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  skills: [],
  activeSkill: null,
  setSkills: (skills) => set({ skills }),
  setActiveSkill: (skillId) => set({ activeSkill: skillId }),
}));
