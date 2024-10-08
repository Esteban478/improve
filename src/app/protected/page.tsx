import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
    </div>
  )
}