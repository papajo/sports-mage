'use client';

import RegisterForm from '../../../components/Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-gray-600 mb-8">Join SportsMage and start betting</p>
        <RegisterForm />
      </div>
    </div>
  );
}

