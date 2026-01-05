'use client';

import LoginForm from '../../../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Log In</h1>
        <p className="text-center text-gray-600 mb-8">Welcome back to SportsMage</p>
        <LoginForm />
      </div>
    </div>
  );
}
