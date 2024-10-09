'use client';

import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

const areaOfExpertiseOptions = [
  'Visa Application',
  'Legal Consultation',
  'Document Translation',
  'Immigration Law',
  'Work Permits',
] as const;

const locationOptions = ['BANGKOK', 'CHIANG_MAI', 'PATTAYA', 'PHUKET', 'HUA_HIN'] as const;

type AreaOfExpertise = typeof areaOfExpertiseOptions[number];
type Location = typeof locationOptions[number];

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [profileData, setProfileData] = useState({
    about: '',
    areaOfExpertise: [] as AreaOfExpertise[],
    location: '' as Location,
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfileData()
    }
  }, [session])

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${session?.user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    redirect('/signin')
  }

  const user = session?.user

  if (!user) {
    return <p>Error: User data not available</p>
  }

  const isProfileComplete = profileData.about.trim() !== '' && 
                            profileData.areaOfExpertise.length > 0 && 
                            profileData.location.trim() !== ''

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!isProfileComplete) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill out all fields before saving.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        setIsEditing(false)
        fetchProfileData() // Refresh the data after saving
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        })
      } else {
        console.error('Failed to update profile')
        toast({
          title: "Update Failed",
          description: "There was an error updating your profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (value: AreaOfExpertise) => {
    setProfileData(prev => {
      const newAreas = prev.areaOfExpertise.includes(value)
        ? prev.areaOfExpertise.filter(area => area !== value)
        : [...prev.areaOfExpertise, value]
      return { ...prev, areaOfExpertise: newAreas }
    })
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      {!isProfileComplete && (
        <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Profile Incomplete</p>
          <p>Please complete your profile to browse and reply to requests.</p>
        </div>
      )}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your account details are below.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.firstName} {user.lastName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Account type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.role === 'SEEKER' ? 'Visa Seeker' : 'Service Provider'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <Textarea
                    name="about"
                    value={profileData.about}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  profileData.about || 'Not provided'
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Area of Expertise</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <div className="space-y-2">
                    {areaOfExpertiseOptions.map((option) => (
                      <label key={option} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          checked={profileData.areaOfExpertise.includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                          className="form-checkbox"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  profileData.areaOfExpertise.join(', ') || 'Not provided'
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isEditing ? (
                  <Select
                    value={profileData.location}
                    onValueChange={(value) => handleSelectChange(value, 'location')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  profileData.location || 'Not provided'
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6">
        {isEditing ? (
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Save Changes
          </Button>
        ) : (
          <Button onClick={handleEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Edit Profile
          </Button>
        )}
      </div>
    </>
  )
}