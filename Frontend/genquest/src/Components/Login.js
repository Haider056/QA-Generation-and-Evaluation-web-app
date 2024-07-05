import React, { useState } from 'react';
import Signupimg from '../Assets/Signup.png';
import { useNavigate } from 'react-router-dom';

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'credentials':'include',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const responseData = await response.json();
        navigate('/Home');
        console.log(responseData);
        localStorage.setItem('id', responseData.id.id); // Setting the id in localStorage
    } else {
        const data = await response.json();
        setError(data.message); // Set error message received from the server
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.'); // Generic error message
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{
      backgroundImage: `url(${Signupimg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="flex flex-col px-16 py-12 text-base leading-4 bg-white rounded-3xl max-w-[540px] max-md:px-5">
        <div className="self-center text-3xl font-semibold text-gray-900 whitespace-nowrap">
          Login to your account
        </div>
        {error && <div className="text-red-500">{error}</div>} 
        <div className="mt-9 capitalize">Email</div>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={handleEmailChange}
          className="self-start mt-3 ml-1 text-sm flex-auto border-2 border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
        />

        <div className="mt-9 capitalize">Password</div>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter Password"
          value={password}
          onChange={handlePasswordChange}
          className="self-start mt-3 ml-1 text-sm flex-auto border-2 border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            className='bg-blue-500 mt-12 text-white w-36 px-4 py-2 rounded-md'
            type="button"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>
        <div className="flex gap-3 self-center mt-7 capitalize whitespace-nowrap">
          <div className="grow text-gray-400">Don't have an account ?</div>{" "}
          <div className="text-sky-500">Sign up</div>
        </div>
      </div>
    </div>
  );
}
