import React from 'react';
import { ServiceProviderRegistrationForm } from '@/components/ServiceProviderRegistrationForm';

export default function ServiceProviderRegistrationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a Service Provider
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          <ServiceProviderRegistrationForm />
        </div>
      </div>
    </div>
  );
}
