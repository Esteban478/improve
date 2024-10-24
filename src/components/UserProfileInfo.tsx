import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@/types/index"

interface UserProfileInfoProps {
  user: UserProfile
  onEdit: () => void
  isEditing: boolean
}

export function UserProfileInfo({ user, onEdit, isEditing }: UserProfileInfoProps) {
  return (
    <Card className="mb-4 rounded">
        <CardHeader className="p-4 pb-2">
            <CardTitle className="text-2xl">
                {user.name || 'Anonymous User'}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
            <p>
                {user.role || 'No role specified'}
            </p>
            <p>
                {user.email}
            </p>
            <p className="text-yellow-400 mt-2 font-medium">
              {user.coins} coins
            </p>
        </CardContent>
        <CardFooter className="p-4 pt-2">
            <Button onClick={onEdit}>
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
        </CardFooter>
    </Card>
  )
}