'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser, registerUser } from '@/lib/apiAuth';

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = isRegistering
        ? await registerUser(formData)
        : await loginUser({ username: formData.username, password: formData.password });

      // Save token in localStorage
      localStorage.setItem('token', response.token);

      // Redirect to homepage
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegistering ? 'Register' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          {isRegistering && (
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          )}

          <Input
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit">
            {isRegistering ? 'Register' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 text-sm text-center">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
