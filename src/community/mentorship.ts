import { CommunityMember } from "../types/community"

export function matchMentor(
  member: CommunityMember,
  mentors: CommunityMember[]
) {
  return mentors
    .filter(m =>
      m.verified &&
      m.region === member.region &&
      m.experienceYears >= member.experienceYears + 5
    )
    .sort((a, b) => b.experienceYears - a.experienceYears)[0]
}
