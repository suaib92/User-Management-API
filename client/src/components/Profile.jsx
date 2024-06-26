import React, { useState, useEffect, Fragment } from 'react';
import { getUserProfile, updateUserProfile, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, Transition } from '@headlessui/react';

const Profile = ({ token, setToken }) => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    about: '',
    skills: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async (currentToken) => {
      try {
        const response = await getUserProfile(currentToken);
        setUser(response.data);
        setIsVerified(response.data.isVerified || false);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          username: response.data.username,
          about: response.data.about || '',
          skills: response.data.skills || [],
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError('Error fetching profile. Please try again later.');
          console.error(error.response?.data || error.message);
        }
      }
    };

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      navigate('/login');
    }
  }, [navigate, setToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(formData, token);
      setUser(response.data);
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        setError('Error updating profile. Please try again later.');
        console.error(error.response?.data || error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout(token);
      setToken('');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      setError('Error logging out. Please try again later.');
      console.error(error.response?.data || error.message);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <div className="relative -mt-16 px-6 pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-white dark:ring-gray-800">
              <AvatarImage src="/placeholder-user.jpg" alt={user?.username} />
              <AvatarFallback>{user?.username}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                {isVerified && <Badge variant="success">Verified</Badge>}
              </div>
              <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" onClick={toggleEditMode}>
                Edit Profile
              </Button>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-500 dark:text-gray-400">
              <p>{formData.about || 'No information provided.'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Transition appear show={editMode} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={toggleEditMode}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-950 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Edit Profile
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid gap-4">
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-lg font-medium mb-2">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="username" className="block text-lg font-medium mb-2">Username</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="about" className="block text-lg font-medium mb-2">About</label>
                        <textarea
                          id="about"
                          name="about"
                          value={formData.about}
                          onChange={handleChange}
                          className="w-full h-24 px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="skills" className="block text-lg font-medium mb-2">Skills</label>
                        <textarea
                          id="skills"
                          name="skills"
                          value={formData.skills.join('\n')}
                          onChange={(e)                           => setFormData({ ...formData, skills: e.target.value.split('\n').map(skill => skill.trim()) })}
                          className="w-full h-24 px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none"
                          placeholder="Enter your skills, one per line..."
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button type="submit" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm focus:outline-none">
                          Update Profile
                        </Button>
                        <Button type="button" onClick={toggleEditMode} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm focus:outline-none">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Profile;

