import { Profile, Experience, Education } from "@/types"

/**
 * Poor Man's Resume Parser (Simulation)
 * In a real-world scenario, this would use a library like 'pdf-parse' 
 * or an external AI service like Claude/GPT or Affinda/RChilli.
 */
export async function parseResume(file: File): Promise<Partial<Profile> & { experience_details?: Experience[], education?: Education[] }> {
  // Simulate network/processing delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  const fileName = file.name.toLowerCase()
  
  // Base extraction result
  const result: Partial<Profile> & { experience_details: Experience[], education: Education[] } = {
    full_name: "",
    headline: "",
    skills: [],
    experience_details: [],
    education: [],
    location: "Bengaluru, India" // Default assumption for this platform's primary market
  }

  // Generic Mock Extraction based on "filename" or just general top-tier data
  // This makes the demo feel "intelligent" and as requested by the user
  result.full_name = "Arjun Mehta"
  result.headline = "Senior Full Stack Engineer | Next.js & Node.js Expert"
  result.skills = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Redis", "AWS"]
  
  result.experience_details = [
    {
      id: "exp-" + Math.random().toString(36).substr(2, 9),
      company: "Zomato",
      role: "Senior Product Engineer",
      duration: "2021 - Present",
      description: "Architected the primary search and exploration interface handling 10M+ daily active users using Next.js 15."
    },
    {
      id: "exp-" + Math.random().toString(36).substr(2, 9),
      company: "ClearTax",
      role: "Software Engineer",
      duration: "2019 - 2021",
      description: "Developed high-performance tax filing modules and integrated bank APIs for seamless user transactions."
    }
  ]

  result.education = [
    {
      id: "edu-" + Math.random().toString(36).substr(2, 9),
      institution: "IIT Bombay",
      degree: "B.Tech in Computer Science",
      year: "2019"
    }
  ]

  return result
}
