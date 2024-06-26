import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, verifyOtp, resendOtp } from '../services/api'; // Ensure resendOtp is imported
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Register = ({ setToken }) => {
  const [formData, setFormData] = useState({ username: '', name: '', email: '', password: '', otp: '' });
  const [step, setStep] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (step === 'register') {
        const response = await register({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        console.log(response.data);
        setStep('verifyOtp');
      } else if (step === 'verifyOtp') {
        const response = await verifyOtp({ email: formData.email, otp: formData.otp });
        console.log('OTP verification response:', response.data);
        setToken(response.data.token);
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.msg || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      await resendOtp({ email: formData.email });
      // Optionally, provide user feedback that OTP has been resent
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.msg || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(prevText => {
        switch (prevText) {
          case 'Loading':
            return 'Loading.';
          case 'Loading.':
            return 'Loading..';
          case 'Loading..':
            return 'Loading...';
          case 'Loading...':
            return 'Loading';
          default:
            return 'Loading';
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="grid w-full max-w-4xl grid-cols-1 rounded-lg bg-white shadow-lg dark:bg-gray-800 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-6 p-8 md:border-r md:border-gray-200 dark:md:border-gray-700">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{step === 'register' ? 'Create an Account' : 'Verify OTP'}</h1>
            <p className="text-gray-500 dark:text-gray-400">{step === 'register' ? 'Sign up to get started' : 'Enter the OTP sent to your email'}</p>
          </div>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {step === 'register' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input id="otp" name="otp" type="text" placeholder="OTP" value={formData.otp} onChange={handleChange} required />
              </div>
            )}
            <Button type="submit" className="w-full">
              {isLoading ? loadingText : step === 'register' ? 'Sign Up' : 'Verify OTP'}
            </Button>
            {step === 'verifyOtp' && (
              <div className="text-center">
                <Button type="button" variant="link" className="mt-4" onClick={handleResendOtp}>
                  Resend OTP
                </Button>
              </div>
            )}
            {errorMessage && <p className="mt-4 text-center text-red-500">{errorMessage}</p>}
          </form>
          <div className="flex w-full items-center justify-between">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <Button variant="ghost" size="sm" className="px-4" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="hidden md:block">
          <img className="h-full w-full object-cover" src="/Leonardo_Diffusion_XL_Double_exposure_Silhouette_of_background_2.jpg" alt="Register Hero" />
        </div>
      </div>
    </div>
  );
};

export default Register;
