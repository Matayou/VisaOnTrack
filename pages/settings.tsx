import React from 'react'
import Head from 'next/head'

export default function Settings() {
  return (
    <>
      <Head>
        <title>Settings - VisaOnTrack</title>
        <meta name="description" content="Manage your VisaOnTrack account settings" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p>Manage your account settings here.</p>
        {/* Add settings form or options here */}
      </div>
    </>
  )
}