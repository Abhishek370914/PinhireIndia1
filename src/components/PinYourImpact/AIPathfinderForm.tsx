'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Check } from 'lucide-react'
import { SEED_COMPANIES } from '@/lib/seed-companies'
import { SEED_JOBS } from '@/lib/seed-jobs'
import type { MatchedCompany } from './PinYourImpact'

interface FormData {
  skills: string[]
  experience: string
  interests: string
  location: string
  impact: string
}

const SKILLS_OPTIONS = [
  '🧪 R&D & Materials Science',
  '⛓️ Supply Chain & Logistics',
  '🧲 Magnet Engineering',
  '📋 Policy & Strategy',
  '💡 Technology & Innovation',
  '🏭 Manufacturing & Process',
  '📊 Analytics & Data',
  '🌍 Sustainability',
]

const EXPERIENCE_OPTIONS = ['Fresh (0-2 yrs)', 'Mid-level (3-7 yrs)', 'Senior (8+ yrs)', 'Leadership']

const INTERESTS_OPTIONS = [
  'Remote work anywhere',
  'India-based roles',
  'Global expansion',
  'Startup ecosystem',
  'Corporate stability',
  'Impact-driven mission',
]

export default function AIPathfinderForm({
  onComplete,
}: {
  onComplete: (profile: any, companies: MatchedCompany[]) => void
}) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    skills: [],
    experience: '',
    interests: '',
    location: 'Anywhere',
    impact: '',
  })

  const handleSkillsToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    // AI Matching Logic: Scan 500+ companies
    const matchedCompanies = matchCompaniesWithJobs(formData)

    setTimeout(() => {
      setLoading(false)
      onComplete(formData, matchedCompanies)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4 text-sm font-semibold text-gray-400">
            <span>Question {step + 1} of 5</span>
            <span>{Math.round(((step + 1) / 5) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
              initial={{ width: `${(step / 5) * 100}%` }}
              animate={{ width: `${((step + 1) / 5) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Questions */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-12"
        >
          {step === 0 && (
            <QuestionContainer
              title="What are your core skills?"
              subtitle="Select all that apply"
              type="multi-select"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SKILLS_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillsToggle(skill)}
                    className={`p-4 rounded-lg border-2 transition-all text-left font-semibold ${
                      formData.skills.includes(skill)
                        ? 'border-green-500 bg-green-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{skill}</span>
                      {formData.skills.includes(skill) && <Check className="w-5 h-5" />}
                    </div>
                  </button>
                ))}
              </div>
            </QuestionContainer>
          )}

          {step === 1 && (
            <QuestionContainer
              title="What's your experience level?"
              subtitle="This helps us match the right opportunities"
              type="single-select"
            >
              <div className="space-y-3">
                {EXPERIENCE_OPTIONS.map(exp => (
                  <button
                    key={exp}
                    onClick={() => setFormData(prev => ({ ...prev, experience: exp }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left font-semibold ${
                      formData.experience === exp
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </QuestionContainer>
          )}

          {step === 2 && (
            <QuestionContainer
              title="What interests you most?"
              subtitle="Choose your primary motivation"
              type="single-select"
            >
              <div className="space-y-3">
                {INTERESTS_OPTIONS.map(int => (
                  <button
                    key={int}
                    onClick={() => setFormData(prev => ({ ...prev, interests: int }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left font-semibold ${
                      formData.interests === int
                        ? 'border-cyan-500 bg-cyan-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {int}
                  </button>
                ))}
              </div>
            </QuestionContainer>
          )}

          {step === 3 && (
            <QuestionContainer
              title="Where would you like to work?"
              subtitle="Location flexibility matters"
              type="text"
            >
              <input
                type="text"
                placeholder="e.g., India, USA, Global, Remote"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-4 rounded-lg bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </QuestionContainer>
          )}

          {step === 4 && (
            <QuestionContainer
              title="What impact do you want to create?"
              subtitle="Tell us your mission"
              type="textarea"
            >
              <textarea
                placeholder="e.g., Help India achieve rare earth independence, Build sustainable supply chains, Advance EV magnet technology..."
                value={formData.impact}
                onChange={e => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                className="w-full p-4 rounded-lg bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 h-24 resize-none"
              />
            </QuestionContainer>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4 justify-between"
        >
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className="px-6 py-3 rounded-lg border border-white/10 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/30 transition-all"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 0 && formData.skills.length === 0) ||
                (step === 1 && !formData.experience) ||
                (step === 2 && !formData.interests)
              }
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-blue-500 transition-all flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-blue-500 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Brain className="w-4 h-4" />
                  </motion.div>
                  AI Matching...
                </>
              ) : (
                <>
                  Find My Matches
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

function QuestionContainer({
  title,
  subtitle,
  type,
  children,
}: {
  title: string
  subtitle: string
  type: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-4xl font-black text-white mb-2">{title}</h2>
      <p className="text-gray-400 text-lg mb-8">{subtitle}</p>
      {children}
    </div>
  )
}

// AI Matching Logic - Scans 500+ companies
function matchCompaniesWithJobs(formData: FormData): MatchedCompany[] {
  const skillKeywords = formData.skills.join(' ').toLowerCase()
  const experienceMultiplier = getExperienceScore(formData.experience)

  // Score each company based on skill match
  const scoredCompanies = (SEED_COMPANIES as any[])
    .map(company => ({
      company,
      score: calculateCompanyScore(company, skillKeywords, formData.interests, experienceMultiplier),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  // Build results with job openings
  return scoredCompanies.map(({ company }, index) => {
    const jobsForCompany = (SEED_JOBS as any[])
      .filter(job => job.company_id === company.id)
      .slice(0, 2)
      .map(job => ({
        title: job.title || 'Position Available',
        description: job.description || 'Exciting opportunity',
        link: company.career_page_url || `https://linkedin.com/company/${company.slug}`,
        isRemote: Math.random() > 0.5, // Demo: random remote tag
      }))

    return {
      id: company.id,
      name: company.name,
      focus: company.description || 'Leading rare earth initiative',
      impactMessage: generateImpactMessage(company.name, formData.skills[0], formData.impact),
      jobs: jobsForCompany.length > 0 ? jobsForCompany : generateDemoJobs(company.name),
    }
  })
}

function calculateCompanyScore(
  company: any,
  skillKeywords: string,
  interests: string,
  experienceMultiplier: number
): number {
  let score = 0

  const companyText = `${company.name} ${company.description || ''} ${company.industry || ''}`.toLowerCase()

  // Skill match
  if (skillKeywords.includes('r&d') && companyText.includes('technology')) score += 5
  if (skillKeywords.includes('supply') && companyText.includes('supply')) score += 5
  if (skillKeywords.includes('engineering') && companyText.includes('engineering')) score += 5
  if (skillKeywords.includes('policy') && companyText.includes('policy')) score += 3
  if (skillKeywords.includes('innovation') && companyText.includes('innovation')) score += 4
  if (skillKeywords.includes('sustainability') && companyText.includes('sustainable')) score += 3

  // Interests match
  if (interests?.includes('remote') && company.company_size === '1000+') score += 2
  if (interests?.includes('impact') && companyText.includes('mission')) score += 3

  // Experience multiplier
  score *= experienceMultiplier

  // Verified boost
  if (company.is_verified) score += 2

  // Job availability boost
  if (company.job_count > 0) score += company.job_count

  return score
}

function getExperienceScore(experience: string): number {
  const scores: Record<string, number> = {
    'Fresh (0-2 yrs)': 1.0,
    'Mid-level (3-7 yrs)': 1.3,
    'Senior (8+ yrs)': 1.5,
    'Leadership': 1.8,
  }
  return scores[experience] || 1.0
}

function generateImpactMessage(company: string, skill: string, impact: string): string {
  const messages = [
    `Your expertise is exactly what ${company} needs to scale rare earth innovation.`,
    `Help ${company}  achieve India's strategic mineral independence goals.`,
    `${company} is seeking talent like you to revolutionize permanent magnet technology.`,
    `Join ${company} in building supply chains that power India's green future.`,
  ]
  return impact ? `${impact} — ${company} shares your mission.` : messages[Math.floor(Math.random() * messages.length)]
}

function generateDemoJobs(company: string) {
  return [
    {
      title: 'Senior Materials Scientist',
      description: 'Lead R&D initiatives in rare earth processing',
      link: `https://linkedin.com/jobs/`,
      isRemote: true,
    },
    {
      title: 'Supply Chain Manager',
      description: 'Optimize global logistics networks',
      link: `https://linkedin.com/jobs/`,
      isRemote: true,
    },
  ]
}
