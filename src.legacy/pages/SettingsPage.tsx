export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="text-sm text-muted-foreground">
        Mock settings page to make the app feel complete.
      </p>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <p className="text-sm font-medium">In a real app you might configure:</p>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>Preferred units (kg/ha vs lb/acre)</li>
          <li>Notification preferences</li>
          <li>Offline data retention</li>
          <li>Language (EN, ES, Hindi, etc.)</li>
        </ul>
      </div>
    </div>
  )
}
