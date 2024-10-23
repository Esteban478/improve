import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SAMPLE_USER_ROLES } from "@/lib/sample-data"

interface UserRoleDropdownProps {
  value: string
  onValueChange: (value: string) => void
  required?: boolean
  label?: boolean
}

export function UserRoleDropdown({ 
  value, 
  onValueChange, 
  required = false,
  label = true
}: UserRoleDropdownProps) {
  return (
    <div>
      {label && (
        <Label htmlFor="role">
          Role {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Select 
        name="role" 
        value={value || "UNDECIDED"} 
        onValueChange={onValueChange}
        required={required}
      >
        <SelectTrigger className={label ? "mt-1" : ""}>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {SAMPLE_USER_ROLES.map((role) => (
            <SelectItem key={role} value={role}>{role}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {required && (
        <p className="text-sm text-gray-500 mt-1">
          * Required for giving feedback to others
        </p>
      )}
    </div>
  )
}