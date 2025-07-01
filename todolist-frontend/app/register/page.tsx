'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5109/api/Auth/register', formData);
      const token = res.data.token;

      localStorage.setItem('token', token);
      router.push('/');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="w-full">
          Register
        </Button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}

