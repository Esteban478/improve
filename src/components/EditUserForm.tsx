'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRoleDropdown } from "./UserRoleDropdown"

interface EditUserFormProps {
  initialName: string
  initialRole: string
  onSave: (formData: FormData) => Promise<void>
}

export default function EditUserForm({ initialName, initialRole, onSave }: EditUserFormProps) {
  const [name, setName] = useState(initialName)
  const [role, setRole] = useState(initialRole)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    await onSave(formData)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
          required
        />
      </div>
      <UserRoleDropdown
        value={role}
        onValueChange={setRole}
        required={true}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}