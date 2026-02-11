export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings (mock)</h2>
      <p className="text-gray-500 text-sm">This is a mock settings page to make the app feel complete.</p>
      <div className="bg-white rounded-xl border p-6">
        <p className="font-medium mb-2">In a real app you might configure:</p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Preferred units (kg/ha vs lb/acre)</li>
          <li>Notification preferences</li>
          <li>Offline data retention</li>
          <li>Language (EN, ES, Hindi, etc.)</li>
        </ul>
      </div>
    </div>
  )
}
