import React, { useState } from "react";
import Signupimg from '../Assets/Signup.png';
import logo from '../Assets/logo.png';

export default function Signup(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async () => {
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
        console.log('Name:', name);

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'credentials':'include',
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Signup successful');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setError(error.message || 'Error during signup. Please try again.');
        }
    };

    return (
        <div className="flex flex-col justify-center bg-white">
            <div className="overflow-hidden w-full max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
                    <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col text-white capitalize leading-[100%] max-md:mt-10 h-screen max-md:max-w-full" style={{
                            backgroundImage: `url(${Signupimg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            <img
                                loading="lazy"
                                srcSet={logo}
                                alt="saved"
                                className="max-w-full aspect-[1.1] w-[221px]"
                            />
                            <div className="flex flex-col pl-10 mt-48 max-md:pl-5 max-md:mt-10 max-md:max-w-full">
                                <div className="text-6xl font-medium max-md:max-w-full max-md:text-4xl">
                                    Welcome to
                                </div>
                                <div className="mt-7 text-8xl font-bold max-md:max-w-full max-md:text-4xl">
                                    GEN QUEST
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex grow justify-center items-center px-16 py-12 w-full bg-white max-md:px-5 max-md:mt-10 max-md:max-w-full">
                            <div className="flex flex-col  max-w-full w-[408px] max-md:mt-10">
                                <div>
                                    <div className="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
                                        <div className="flex flex-col w-[82%] max-md:ml-0 max-md:w-full">
                                            <div className="flex flex-col grow text-base leading-4 whitespace-nowrap text-slate-700 max-md:mt-10">
                                                <div className="text-3xl self-center font-semibold text-gray-900">
                                                    Create an account
                                                </div>
                                                {error && <div className="text-red-500">{error}</div>}
                                                <div className="mt-9 capitalize">Email</div>
                                                <input
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    className="self-start mt-3 ml-1  text-sm flex-auto border-2  border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                                                />
                                                <div className="mt-9 capitalize">Name</div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Name"
                                                    value={name}
                                                    onChange={handleNameChange}
                                                    className="self-start mt-3 ml-1  text-sm flex-auto border-2  border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                                                />
                                                <div className="mt-9 capitalize">Password</div>
                                                <input
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                    className="self-start mt-3 ml-1  text-sm flex-auto border-2  border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                                                />
                                                <div className="mt-9 capitalize">Confirm Password</div>
                                                <input
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={handleConfirmPasswordChange}
                                                    className="self-start mt-3 ml-1  text-sm flex-auto border-2  border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <button
                                        className='bg-blue-500 mt-12 mr-12 text-white w-36 px-4 py-2 rounded-md'
                                        type="button"
                                        onClick={handleSubmit}
                                    >
                                        Sign Up
                                    </button>
                                </div>

                                <div className="flex gap-3 self-center  mt-6 text-base leading-4 capitalize whitespace-nowrap">
                                    <div className="grow text-gray-400">
                                        Already have an account ?
                                    </div>
                                    <div className="text-blue-600">Log in</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
