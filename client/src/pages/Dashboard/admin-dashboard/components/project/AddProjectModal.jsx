import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const AddProjectModal = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    projectName: false,
    projectDescription: false,
    deadline: false,
  });

  useEffect(() => {
    if (touched.projectName) validateProjectName(projectName);
  }, [projectName, touched.projectName]);

  useEffect(() => {
    if (touched.projectDescription) validateProjectDescription(projectDescription);
  }, [projectDescription, touched.projectDescription]);

  useEffect(() => {
    if (touched.deadline) validateDeadline(deadline);
  }, [deadline, touched.deadline]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setTouched({
      projectName: true,
      projectDescription: true,
      deadline: true,
    });
    if (Object.keys(validationErrors).length === 0) {
      const token = localStorage.getItem('token'); // Get token from local storage
      const formattedDeadline = formatDeadline(deadline); // Format the deadline
      const projectData = {
        name: projectName,
        description: projectDescription,
        deadline: formattedDeadline,
        tags: [] // Replace with actual tags if needed
      };

      try {
        const response = await axios.post('http://localhost:3001/project/create', projectData, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          toast.success('Project created successfully!'); // Show success message
          onClose(); // Close modal after submission
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            toast.error('Unauthorized! Please log in again.'); // Show unauthorized message
          } else if (error.response.status === 500) {
            toast.error('Internal server error! Please try again later.'); // Show server error
          }
        } else {
          toast.error('An unexpected error occurred!'); // Show general error message
        }
      }
    }
  };

  const formatDeadline = (date) => {
    const [year, month, day] = date.split('-'); // Assuming input format is YYYY-MM-DD
    return `${day}/${month}/${year}`; // Format to DD/MM/YYYY
  };

  const validateProjectName = (name) => {
    if (name.length < 4) {
      setErrors((prev) => ({ ...prev, projectName: 'Project name must be at least 4 characters long' }));
    } else {
      setErrors((prev) => ({ ...prev, projectName: undefined }));
    }
  };

  const validateProjectDescription = (description) => {
    if (description.split(' ').length < 10) {
      setErrors((prev) => ({ ...prev, projectDescription: 'Project description must be at least 10 words long' }));
    } else {
      setErrors((prev) => ({ ...prev, projectDescription: undefined }));
    }
  };

  const validateDeadline = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    const minDeadline = new Date(currentDate.setDate(currentDate.getDate() + 2));
    if (!date || selectedDate < minDeadline) {
      setErrors((prev) => ({ ...prev, deadline: 'Deadline must be at least 2 days ahead of today' }));
    } else {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (projectName.length < 4) {
      errors.projectName = 'Project name must be at least 4 characters long';
    }
    if (projectDescription.split(' ').length < 10) {
      errors.projectDescription = 'Project description must be at least 10 words long';
    }
    const selectedDate = new Date(deadline);
    const currentDate = new Date();
    const minDeadline = new Date(currentDate.setDate(currentDate.getDate() + 2));
    if (!deadline || selectedDate < minDeadline) {
      errors.deadline = 'Deadline must be at least 2 days ahead of today';
    }
    return errors;
  };

  const handleFocus = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <>
      <ToastContainer /> {/* Include ToastContainer for displaying toasts */}
      {isOpen && (
        <div className="z-50 fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300">
          <div className="bg-white py-12 px-12 rounded-lg shadow-lg max-w-lg mx-h-lg w-full relative">
            <h2 className="text-xl font-semibold mb-4">Add New Project</h2>

            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-700 shadow-2xl text-4xl"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit}>
              {/* Project Name */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onFocus={() => handleFocus('projectName')}
                  className={`w-full p-2 border ${touched.projectName && errors.projectName ? 'border-red-500' : 'border-black'} rounded focus:outline-none focus:border-blue-500`}
                />
                {touched.projectName && errors.projectName && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
                )}
              </div>

              {/* Project Description */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  onFocus={() => handleFocus('projectDescription')}
                  className={`w-full p-2 border ${touched.projectDescription && errors.projectDescription ? 'border-red-500' : 'border-black'} rounded focus:outline-none focus:border-blue-500`}
                />
                {touched.projectDescription && errors.projectDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>
                )}
              </div>

              {/* Deadline */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  onFocus={() => handleFocus('deadline')}
                  className={`w-full p-2 border ${touched.deadline && errors.deadline ? 'border-red-500' : 'border-black'} rounded focus:outline-none focus:border-blue-500`}
                />
                {touched.deadline && errors.deadline && (
                  <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
              >
                Add Project
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProjectModal;