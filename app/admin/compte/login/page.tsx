'use client';
import React, { useState } from 'react';
import axiosInstance from '@/app/admin/payment/utils/axios'; // Assurez-vous que cette importation est correcte
//import AdminLayout from '@/components/AdminLayout';
import AdminLayout from '@/components/AdminLayout';

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/client/login", formData);

      // Assuming the response contains a token
      const token = response.data.accessToken;

      // Save the token in localStorage
      localStorage.setItem('authToken', token);

      // Update axios instance to use the token for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setMessage('Login successful!');
      console.log('Login successful:', response.data);
      // Redirect or perform any additional actions here if necessary
    } catch (error) {
      setError('Error logging in. Please check your credentials and try again.');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {message && <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default LoginForm;