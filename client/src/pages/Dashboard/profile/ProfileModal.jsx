import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaUserEdit, FaKey } from 'react-icons/fa';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileModal = ({ isOpen, onClose, onResetPassword }) => {
  const user = {
    name: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
    status: 'verified', 
    joinDate: localStorage.getItem("userJoindate")
  };

  const formattedJoinDate = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (newName.length < 2) {
      toast.error('Username must be at least 2 characters long.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:3001/user/edit-name',
        { name: newName },
        { headers: { authorization: localStorage.getItem('token') } }
      );

      if (response.status === 200) {
        localStorage.setItem('userName', newName);
        toast.success('Username updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Invalid input. Please try again.');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick />
      <div className="relative max-w-sm w-full bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center mb-4">
          <div className='pt-6'>
            <img className="w-16 h-16 rounded-full mb-3" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="User profile" />
          </div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            {user.status === 'verified' ? (
              <FaCheckCircle className="text-green-500 w-5 h-5" title="Verified User" />
            ) : (
              <FaExclamationCircle className="text-red-500 w-5 h-5" title="Blocked User" />
            )}
          </div>
          <p className="text-sm text-gray-500 mb-8">{user.email}</p>
          <p className="text-sm text-gray-400 mt-2">Joined on: {formattedJoinDate}</p>
        </div>

        {isEditing ? (
          <div className="flex flex-col mt-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mb-3"
              placeholder="Enter new username"
            />
            <div className="flex justify-between space-x-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center w-full bg-indigo-500 text-white py-2 rounded-lg shadow hover:bg-indigo-600"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="w-full bg-gray-500 text-white py-2 rounded-lg shadow hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-4 mt-4">
            <button onClick={handleEditProfile} className="flex items-center justify-center flex-1 bg-indigo-500 text-white py-2 rounded-lg shadow hover:bg-indigo-600">
              <FaUserEdit className="mr-2" />
              Edit Profile
            </button>
            <button className="flex items-center justify-center flex-1 bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-500" onClick={onResetPassword}>
              <FaKey className="mr-2" />
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
