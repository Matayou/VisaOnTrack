'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, SettingsIcon, LockIcon, ShieldIcon, BellIcon } from 'lucide-react';

export default function AccountPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }

  const accountSections = [
    {
      title: "Personal details",
      description: "Update your information and manage your profile.",
      icon: <UserIcon className="w-8 h-8" />,
      link: "/profile",
      linkText: "Manage personal details"
    },
    {
      title: "Account preferences",
      description: "Change your language and accessibility settings.",
      icon: <SettingsIcon className="w-8 h-8" />,
      link: "/account/preferences",
      linkText: "Manage preferences"
    },
    {
      title: "Security settings",
      description: "Change your security settings and manage account access.",
      icon: <LockIcon className="w-8 h-8" />,
      link: "/account/security",
      linkText: "Manage account security"
    },
    {
      title: "Privacy settings",
      description: "Control how your information is used and shared.",
      icon: <ShieldIcon className="w-8 h-8" />,
      link: "/account/privacy",
      linkText: "Manage privacy"
    },
    {
      title: "Notification preferences",
      description: "Choose what you want to be notified about.",
      icon: <BellIcon className="w-8 h-8" />,
      link: "/account/notifications",
      linkText: "Manage notifications"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Account settings</h1>
      <p className="text-gray-600 mb-8">Manage your VisaOnTrack experience</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accountSections.map((section, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center space-x-4">
                {section.icon}
                <CardTitle>{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <CardDescription className="mb-4 flex-grow">{section.description}</CardDescription>
              <Button asChild variant="outline" className="w-full mt-auto">
                <Link href={section.link}>{section.linkText}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}