import Link from "next/link"
import UserAvatar from "./UserAvatar"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import ErrorDisplay from "./ErrorDisplay"
import { catchErrorTyped } from "@/lib/utils"
import { getUserProfile } from "../actions/user-actions"

export default async function DashboardUserProfile({ email }: { email: string }) {
  const [error, user] = await catchErrorTyped(getUserProfile(email))
  if (error || !user) return <ErrorDisplay message="Unable to load user profile." />

    return (
    <>
    <h2 className="text-xl font-bold mb-2">Profile</h2>
        <Card className="mb-6 rounded">
        <CardHeader className="p-4 pb-2">
            <CardTitle>{user.name}</CardTitle>
            <CardDescription className="text-xs">
                {user.role || 'No role specified'}
            </CardDescription>
            </CardHeader>
        
        <CardFooter className="flex p-4 pt-2 gap-2">
            <Link href="/profile">
            <Button variant="secondary" size="sm">
                View Profile
            </Button>
            </Link>
        </CardFooter>
        </Card>
    </>
  )
}