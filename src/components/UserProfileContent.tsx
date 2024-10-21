'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/UserAvatar"
import EditUserForm from "@/components/EditUserForm"
import ActivityHistory from "@/components/ActivityHistory"

interface UserProfileContentProps {
  userProfile: any
  initialLogs: any[]
  totalCount: number
  updateProfileAction: (formData: FormData) => Promise<void>
  loadMoreLogsAction: (email: string, page: number) => Promise<any[]>
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
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <UserAvatar src={userProfile.image} alt={userProfile.name || 'User'} size={100} />
          <div className="ml-4">
            <h2 className="text-2xl font-semibold">{userProfile.name || 'Anonymous User'}</h2>
            <p className="text-gray-600">{userProfile.email}</p>
            <p className="text-gray-600">{userProfile.role || 'No role specified'}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          <p>Coins: {userProfile.coins}</p>
          <p>Average Rating: {userProfile.averageRating?.toFixed(2) || 'N/A'}</p>
          <p>Total Critiques Given: {userProfile.totalCritiquesGiven}</p>
          <p>Total Ratings Received: {userProfile.totalRatingsReceived}</p>
        </div>

        <Button onClick={toggleEdit} className="mt-4">
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      {isEditing && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          <EditUserForm
            initialName={userProfile.name || ''}
            initialRole={userProfile.role || ''}
            onSave={handleUpdateProfile}
          />
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <ActivityHistory 
          initialLogs={initialLogs} 
          totalCount={totalCount} 
          userEmail={userProfile.email}
          loadMoreLogs={loadMoreLogsAction}
        />
      </div>
    </div>
  )
}