import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Suspense } from 'react'
import DashboardUserProfile from "@/src/components/DashboardUserProfile"
import DashboardUserTracks from "@/src/components/DashboardUserTracks"
import DashboardUserCritiques from "@/src/components/DashboardUserCritiques"

export default async function Dashboard() {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    redirect("/auth/sign-in?callbackUrl=/dashboard")
  }

  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<div>Loading profile...</div>}>
        <DashboardUserProfile email={session.user.email} />
      </Suspense>

      <Suspense fallback={<div>Loading tracks...</div>}>
        <DashboardUserTracks email={session.user.email} />
      </Suspense>

      <Suspense fallback={<div>Loading critiques...</div>}>
        <DashboardUserCritiques email={session.user.email} />
      </Suspense>
    </div>
  )
}