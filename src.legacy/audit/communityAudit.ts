export function communityAuditLog(entry: {
  memberId: string
  action: string
  linkedDecisionId?: string
}) {
  return {
    timestamp: new Date().toISOString(),
    memberId: entry.memberId,
    action: entry.action,
    linkedDecisionId: entry.linkedDecisionId || null,
    compliant: true
  }
}
