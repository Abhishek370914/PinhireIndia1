import { Profile } from "@/types"

export interface ProfileSection {
  id: string
  label: string
  weight: number
  isComplete: boolean
  progress: number
  suggestion: string
}

export function calculateProfileStrength(profile: Profile | null, hasResume: boolean = false) {
  if (!profile) return { total: 0, sections: [] }

  const sections: ProfileSection[] = [
    {
      id: "basic",
      label: "Basic Info",
      weight: 15,
      isComplete: !!(profile.full_name && profile.location && profile.headline),
      progress: 
        (profile.full_name ? 33.3 : 0) + 
        (profile.location ? 33.3 : 0) + 
        (profile.headline ? 33.4 : 0),
      suggestion: "Add your full name, location, and a catchy headline"
    },
    {
      id: "skills",
      label: "Skills",
      weight: 20,
      isComplete: (profile.skills?.length || 0) >= 5,
      progress: Math.min(((profile.skills?.length || 0) / 5) * 100, 100),
      suggestion: "Add at least 5 key skills to showcase your expertise"
    },
    {
      id: "experience",
      label: "Experience Details",
      weight: 20,
      isComplete: (profile.experience_details?.length || 0) > 0,
      progress: (profile.experience_details?.length || 0) > 0 ? 100 : 0,
      suggestion: "Add your previous work experience"
    },
    {
      id: "education",
      label: "Education",
      weight: 15,
      isComplete: (profile.education?.length || 0) > 0,
      progress: (profile.education?.length || 0) > 0 ? 100 : 0,
      suggestion: "Add your latest education qualification"
    },
    {
      id: "preferences",
      label: "Job Preferences",
      weight: 15,
      isComplete: !!(profile.preferred_role && profile.expected_salary && (profile.location || profile.preferred_location)),
      progress: 
        (profile.preferred_role ? 33.3 : 0) + 
        (profile.expected_salary ? 33.3 : 0) + 
        (profile.location || profile.preferred_location ? 33.4 : 0),
      suggestion: "Set your target role, salary, and preferred location"
    },
    {
      id: "resume",
      label: "Resume Upload",
      weight: 15,
      isComplete: hasResume,
      progress: hasResume ? 100 : 0,
      suggestion: "Upload your resume (PDF/DOC) for auto-fill and 2x visibility"
    }
  ]

  const total = sections.reduce((acc, section) => {
    return acc + (section.progress * section.weight) / 100
  }, 0)

  return {
    total: Math.round(total),
    sections
  }
}

export function getStrengthColor(percentage: number) {
  if (percentage < 50) return "text-red-500"
  if (percentage < 80) return "text-amber-500"
  return "text-emerald-500"
}

export function getStrengthBgColor(percentage: number) {
  if (percentage < 50) return "bg-red-500"
  if (percentage < 80) return "bg-amber-500"
  return "bg-emerald-500"
}
