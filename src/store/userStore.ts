"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Profile, Experience, Education } from "@/types"

interface UserState {
  profile: Profile | null
  resumeUrl: string | null
  
  // Actions
  setProfile: (profile: Partial<Profile>) => void
  addExperience: (exp: Experience) => void
  addEducation: (edu: Education) => void
  setSkills: (skills: string[]) => void
  setExperiences: (exps: Experience[]) => void
  setEducation: (edu: Education[]) => void
  setResume: (url: string | null) => void
  resetProfile: () => void
}

const INITIAL_PROFILE: Profile = {
  id: "user-default",
  full_name: "",
  avatar_url: null,
  email: "",
  location: "",
  headline: "",
  experience_years: null,
  skills: [],
  experience_details: [],
  education: [],
  preferred_role: "",
  preferred_location: "",
  expected_salary: null,
  created_at: new Date().toISOString(),
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: INITIAL_PROFILE,
      resumeUrl: null,

      setProfile: (partial) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...partial } : { ...INITIAL_PROFILE, ...partial },
        })),

      addExperience: (exp) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                experience_details: [...state.profile.experience_details, exp],
              }
            : null,
        })),

      addEducation: (edu) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                education: [...state.profile.education, edu],
              }
            : null,
        })),

      setSkills: (skills) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, skills } : null,
        })),

      setExperiences: (exps) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, experience_details: exps } : null,
        })),

      setEducation: (edu) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, education: edu } : null,
        })),

      setResume: (url) => set({ resumeUrl: url }),

      resetProfile: () => set({ profile: INITIAL_PROFILE, resumeUrl: null }),
    }),
    {
      name: "pinhire-user-storage",
    }
  )
)
