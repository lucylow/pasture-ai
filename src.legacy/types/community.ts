export type CommunityMember = {
  memberId: string
  role: "farmer" | "mentor" | "advisor"
  region: string
  pastureSystem: "rotational" | "holistic" | "set_stocking"
  experienceYears: number
  verified: boolean
}

export type CommunityCluster = {
  clusterId: string
  region: string
  climateZone: string
  pastureType: string
  memberCount: number
}
