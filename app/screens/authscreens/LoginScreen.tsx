"use client";
import React, { useState } from 'react';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = (e: any) => {
        alert("submitted.")
        e.preventDefault();
        // For now, just log the values (replace with API call later)
        console.log('Email:', email);
        console.log('Password:', password);
       
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-white px-4 sm:px-8 md:px-16 lg:px-32 overflow-hidden">

           
            <div className="
                        absolute top-0 right-0 
                        w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 
                        bg-primary rounded-full 
                        translate-x-1/2
                        -translate-y-1/2">
            </div>

            <div className="w-full sm:max-w-md z-10">
                <h1 className="text-4xl font-bold mb-2 ">Irls</h1>
                <h2 className="text-xl font-semibold mb-8">Login</h2>


                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-lg mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-black focus:outline-none text-base py-2"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-black focus:outline-none text-base py-2"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="text-right text-sm text-gray-700">
                        Forgot Password?
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white text-lg py-3 rounded-2xl mt-4"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    Don’t have an account?{' '}
                    <span className="text-blue-700 font-semibold cursor-pointer">Sign Up</span>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary rounded-tr-xl rotate-[-20deg] sm:w-32 h-32 md:w-40 h-40 translate-y-1/2"></div>
        </div>

    );
};

export default LoginScreen;
