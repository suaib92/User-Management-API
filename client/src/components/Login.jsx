import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      setToken(response.data.token);
      alert('Login successful');
      navigate('/profile');
    } catch (error) {
      setError('Invalid email or password');
      console.error(error.response?.data || error.message);
    }
  };

  const handleInputFocus = () => {
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="grid w-full max-w-4xl grid-cols-1 rounded-lg bg-white shadow-lg dark:bg-gray-800 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-6 p-8 md:border-r md:border-gray-200 dark:md:border-gray-700">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
          </div>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <Input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} onFocus={handleInputFocus} required />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
          <div className="flex w-full items-center justify-between">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <Button variant="ghost" size="sm" className="px-4" onClick={() => navigate('/register')}>
              Sign Up
            </Button>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="hidden items-center justify-center bg-gray-100 p-8 dark:bg-gray-800 md:flex">
          <img src="/Leonardo_Diffusion_XL_Double_exposure_Silhouette_of_background_2.jpg" alt="Login" width="500" height="500" className="max-w-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Login;
