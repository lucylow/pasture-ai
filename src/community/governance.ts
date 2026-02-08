export function communityGovernance(event: {
  type: "practice_submission" | "comment" | "flag"
  memberVerified: boolean
}) {
  if (!event.memberVerified) {
    return { allowed: false, reason: "Unverified member" }
  }

  return { allowed: true }
}
