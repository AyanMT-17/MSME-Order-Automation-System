import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleLogInClick = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSignedUp(true);
    // try {
    //   const response = await axios.post('http://localhost:5000/api/auth/register', { username, password });
    //   console.log(response.data);
    // } catch (error) {
    //   console.error(error.response.data);
    // }
  };

  if (isSignedUp) {
    return <Navigate to="/admindashboard" />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <p className="text-gray-600 mb-4">Create a new account</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-2 mb-4 border rounded"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 mb-4 border rounded"
          />
          <button 
            type="submit" 
            className="bg-black text-white px-4 py-2 rounded mr-2"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
          <button 
            onClick={handleLogInClick} 
            className="border border-black px-4 py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;