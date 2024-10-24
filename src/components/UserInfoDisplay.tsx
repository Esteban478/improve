import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import UserAvatar from './UserAvatar'
import { MinimalUser } from '@/types/index'

interface UserInfoDisplayProps {
  user: MinimalUser
  timestamp: Date
  size?: number
  showRole?: boolean
  additionalInfo?: string // For average rating or other info
}

export function UserInfoDisplay({ 
  user, 
  timestamp, 
  size = 40,
  showRole = true,
  additionalInfo
}: UserInfoDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar 
        src={user.image} 
        alt={user.name || 'User'} 
        size={size} 
      />
      <div>
        <p className="font-semibold flex items-center gap-2">
          {user.name || "Unknown User"}
          {showRole && user.role && (
            <span className="text-sm text-muted-foreground">
              ({user.role})
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </p>
        {additionalInfo && (
          <p className="text-sm text-foreground mt-1">
            {additionalInfo}
          </p>
        )}
      </div>
    </div>
  )
}