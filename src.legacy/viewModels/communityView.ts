import { CommunityMember } from "../types/community"

export function communityViewModel(data: {
  peerComparison: any
  practices: any[]
  mentor?: CommunityMember
}) {
  return {
    sections: [
      { title: "How you compare", data: data.peerComparison },
      { title: "Proven practices", data: data.practices },
      data.mentor ? { title: "Your mentor", data: data.mentor } : null
    ].filter(Boolean)
  }
}
