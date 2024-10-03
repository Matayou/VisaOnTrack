import React, { useState } from 'react'
import { Input } from './input'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function PasswordInput({ label, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className="pr-10"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  )
}