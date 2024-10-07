'use client';

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const locations = ['Bangkok', 'Chiang Mai', 'Chiang Rai', 'Phuket', 'Pattaya']
const visaTypes = ['Tourist', 'Business', 'Retirement', 'Education', 'Marriage']

const dummyRequests = [
  { id: 1, location: 'Bangkok', visaType: 'Tourist', description: 'Need assistance with 60-day tourist visa extension' },
  { id: 2, location: 'Chiang Mai', visaType: 'Business', description: 'Applying for a work permit and non-immigrant B visa' },
  { id: 3, location: 'Phuket', visaType: 'Retirement', description: 'Help with retirement visa application for a US citizen' },
  { id: 4, location: 'Pattaya', visaType: 'Marriage', description: 'Need guidance on marriage visa process with Thai spouse' },
  { id: 5, location: 'Bangkok', visaType: 'Education', description: 'Assistance required for student visa application' },
]

export function BrowseRequestsContent() {
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedVisaType, setSelectedVisaType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRequests = dummyRequests.filter(request => 
    (!selectedLocation || request.location === selectedLocation) &&
    (!selectedVisaType || request.visaType === selectedVisaType) &&
    (!searchTerm || request.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="visaType">Visa Type</Label>
          <Select value={selectedVisaType} onValueChange={setSelectedVisaType}>
            <SelectTrigger>
              <SelectValue placeholder="Select visa type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Visa Types</SelectItem>
              {visaTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequests.map(request => (
          <div key={request.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.visaType} Visa Request</h3>
            <p className="text-gray-600 mb-2">{request.location}</p>
            <p className="text-gray-600 mb-4">{request.description}</p>
            <Button>View Details</Button>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No requests found matching your criteria.
        </div>
      )}
    </div>
  )
}