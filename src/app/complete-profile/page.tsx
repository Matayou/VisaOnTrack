import { ProfileCompletionForm } from '@/components/ProfileCompletionForm'

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Welcome to VisaOnTrack!</h1>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Complete Your Profile</h2>
          <p className="text-gray-600 mb-8">
            We're thrilled to have you on board! To provide you with the best possible experience and match you with the right service providers, we need a bit more information about your current situation. This will help us tailor our services to your specific visa requirements and personal circumstances.
          </p>
          <ProfileCompletionForm />
        </div>
      </div>
    </div>
  )
}
