import React, { useState } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogged(true);
    // try {
    //   const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    //   console.log(response.data);
    //   setIsLogged(false);
    // } catch (error) {
    //   console.error(error.response?.data || "Login failed");
    // }
  };

  const handleClick = () => {
    setIsLogged(true);
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <>
      {isLogged ? (
        <Navigate to="/admindashboard" />
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <p className="text-gray-600 mb-4">Enter your credentials</p>
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
                onClick={handleClick}
              >
                Login
              </button>
              <button  
                type="button"
                className="border border-black px-4 py-2 rounded"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
