'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserProfileInfo } from "@/components/UserProfileInfo"
import { UserProfileStats } from "@/components/UserProfileStats"
import EditUserForm from "@/components/EditUserForm"
import ActivityHistory from "@/components/ActivityHistory"
import { ActivityLog } from '@prisma/client'
import { UserProfile } from '../types'

interface UserProfileContentProps {
  userProfile: UserProfile
  initialLogs: ActivityLog[]
  totalCount: number
  updateProfileAction: (formData: FormData) => Promise<void>
  loadMoreLogsAction: (email: string, page: number) => Promise<ActivityLog[]>
}

export default function UserProfileContent({ 
  userProfile, 
  initialLogs, 
  totalCount, 
  updateProfileAction,
  loadMoreLogsAction
}: UserProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(!isEditing)

  const handleUpdateProfile = async (formData: FormData) => {
    await updateProfileAction(formData)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <UserProfileInfo 
          user={userProfile} 
          onEdit={toggleEdit} 
          isEditing={isEditing} 
        />
        <UserProfileStats 
          user={userProfile} 
        />
      </div>

      {isEditing && (
        <Card className="rounded mb-6">
          <CardHeader className="p-4 pb-2">
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <EditUserForm
              initialName={userProfile.name || ''}
              initialRole={userProfile.role || ''}
              onSave={handleUpdateProfile}
            />
          </CardContent>
        </Card>
      )}
      
      <ActivityHistory 
        initialLogs={initialLogs} 
        totalCount={totalCount} 
        userEmail={userProfile.email}
        loadMoreLogs={loadMoreLogsAction}
      />
    </div>
  )
}