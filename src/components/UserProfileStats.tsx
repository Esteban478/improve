import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserProfile } from "@/types/index"

interface UserProfileStatsProps {
  user: UserProfile
}

export function UserProfileStats({ user }: UserProfileStatsProps) {
  const stats = [
    {
      label: "Registered",
      value: user.createdAt.toLocaleDateString("de-DE"),
    },
    {
      label: "Critiques Given",
      value: user.totalCritiquesGiven,
    },
    {
      label: "Ratings Received",
      value: user.totalRatingsReceived,
    },
    {
      label: "Average Rating",
      value: user.averageRating?.toFixed(2) || 'N/A',
    },
  ]

  return (
    <Card className="mb-4 rounded">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl font-semibold">
            Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 grid gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between">
            <span className="text-muted-foreground">{stat.label}</span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}