'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="border p-6 bg-card rounded mb-6">
        <div className="flex justify-between">
          {/* User Info Section */}
          <div className="flex items-start space-x-4">
            <UserAvatar src={userProfile.image} alt={userProfile.name || 'User'} size={100} />
            <div>
              <h2 className="text-2xl font-semibold">{userProfile.name || 'Anonymous User'}</h2>
              <p className="text-gray-600">{userProfile.role || 'No role specified'}</p>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-yellow-600 mt-2">{userProfile.coins} coins</p>
            </div>
          </div>

          {/* Statistics Section */}
          <div>
            <h3 className="text-xl font-semibold">Statistics</h3>
            <p className="text-gray-700">Registered: {userProfile.createdAt.toLocaleDateString("de-DE")}</p>
            <p className="text-gray-700">
            Critiques Given: <span className="font-medium">{userProfile.totalCritiquesGiven}</span>
            </p>
            <p className="text-gray-700">
            Ratings Received: <span className="font-medium">{userProfile.totalRatingsReceived}</span>
            </p>
            <p className="text-gray-700">
            Average Rating: <span className="font-medium">{userProfile.averageRating?.toFixed(2) || 'N/A'}</span>
            </p>
          </div>
        </div>
              <Button onClick={toggleEdit} className="mt-4">
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
      </div>

      {isEditing && (
        <div className="border p-4 rounded mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <EditUserForm
            initialName={userProfile.name || ''}
            initialRole={userProfile.role || ''}
            onSave={handleUpdateProfile}
          />
        </div>
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