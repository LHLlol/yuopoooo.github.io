import { profileData } from "./profileData";
import { portfolioCategories, portfolioItems } from "./portfolioData";

export const portfolioKnowledge = {
  profile: {
    name: profileData.nameCN,
    nameEN: profileData.nameEN,
    role: profileData.role,
    summary: profileData.summary,
    location: profileData.location,
    education: profileData.education,
  },
  focusAreas: profileData.focusAreas,
  skills: profileData.skills,
  software: profileData.software,
  experiences: profileData.experiences,
  achievements: profileData.achievements,
  categories: portfolioCategories,
  projects: portfolioItems,
} as const;

export type PortfolioKnowledge = typeof portfolioKnowledge;
