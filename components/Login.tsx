"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Login() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {

        if (email === '' || password === '') {
            return;
        }

        if (email === 'admin@bioverse.com' && password === 'Password123!') {
            router.push('/admin_panel');
            return;
        }

        if (email === 'user1@gmail.com' && password === 'Password123!') {
            router.push('/qu_select');
            return;
        }
        
        alert('Login failed');
    }

    return (

        <div className="bg-cyan-200 flex flex-col justify-center w-48 mx-auto py-16 ">

            <p className='text-center text-4xl mb-10'>Login</p>

            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} />

            <p>Password</p>
            <input type='password' onChange={(e) => setPassword(e.target.value)} />

            <button 
                className='bg-cyan-400 w-20 mx-auto mt-5'
                onClick={handleSubmit}
            >
                Submit
            </button>

        </div>

    );

}