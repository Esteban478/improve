import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { getUserProfile, getUserActivityLogs, updateUserProfile, loadMoreActivityLogs } from "@/actions/user-actions"
import UserProfileContent from "@/components/UserProfileContent"

export default async function ProfilePage() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/auth/sign-in?callbackUrl=/profile")
  }

  const userProfile = await getUserProfile(session.user.email)
  const { logs: initialLogs, totalCount } = await getUserActivityLogs(session.user.email)

  if (!userProfile) {
    return <div>Failed to load user profile</div>
  }

  async function updateProfileAction(formData: FormData) {
    'use server'
    const name = formData.get('name')
    const role = formData.get('role')

    if (typeof name !== 'string' || typeof role !== 'string') {
      throw new Error('Invalid form data')
    }

    await updateUserProfile(userProfile!.email, { name, role })
  }

  async function loadMoreLogsAction(email: string, page: number) {
    'use server'
    return loadMoreActivityLogs(email, page)
  }

  return (
    <UserProfileContent 
      userProfile={userProfile} 
      initialLogs={initialLogs} 
      totalCount={totalCount}
      updateProfileAction={updateProfileAction}
      loadMoreLogsAction={loadMoreLogsAction}
    />
  )
}