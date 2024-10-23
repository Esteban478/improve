'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ActivityLog } from '@prisma/client'

interface ActivityHistoryProps {
  initialLogs: ActivityLog[]
  totalCount: number
  userEmail: string
  loadMoreLogs: (email: string, page: number) => Promise<ActivityLog[]>
}

export default function ActivityHistory({ initialLogs, totalCount, userEmail, loadMoreLogs }: ActivityHistoryProps) {
  const [logs, setLogs] = useState(initialLogs)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = async () => {
    setIsLoading(true)
    try {
      const newLogs = await loadMoreLogs(userEmail, page + 1)
      setLogs([...logs, ...newLogs])
      setPage(page + 1)
    } catch (error) {
      console.error("Failed to load more logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border bg-card rounded p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      {logs.length > 0 ? (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log.id} className="border-b pb-2">
              <p className="font-semibold">{log.action}</p>
              <p className="text-sm text-gray-600">{log.details}</p>
              <p className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity.</p>
      )}
      {logs.length < totalCount && (
        <Button onClick={handleLoadMore} disabled={isLoading} className="mt-4">
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  )
}