import { cn } from '@/lib/utils'

export interface ProfileOverviewProps {
  userId: string
}

export function ProfileOverview({ userId }: ProfileOverviewProps) {
  return (
    <div className={cn("rounded-xl border p-6 shadow-sm", {
      "bg-card": true,
    })}>
      <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
      <p className="text-muted text-sm">
        Build your intuitive profile with your business requirements and preferences.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <select className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Founder/CEO</option>
            <option>Product Manager</option>
            <option>Engineering Lead</option>
            <option>Designer</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <select className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Primary Goals</label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Launch MVP, Scale to 100 users"
          />
        </div>
      </div>
    </div>
  )
}