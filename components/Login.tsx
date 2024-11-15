"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

interface SupabaseConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
}

export default function Login() {

    const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    //fetch the supabase config without exposing
    useEffect(() => {
        const fetchSupabaseConfig = async () => {
          try {
            const response = await fetch('/api/supabase_config', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json();
            setSupabaseConfig(data);
          } catch (error) {
            console.error("Error fetching Supabase config", error);
          }
        };

        fetchSupabaseConfig();
    }, []);

    if (!supabaseConfig) {
        return <div></div>;
    }

    const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);
    


    const handleSubmit = async () => {

        if (email === '' || password === '') {
            return;
        }

        if (email === 'admin@bioverse.com' && password === 'Password123') {
            router.push('/admin_panel');
            return;
        }

        if (email === 'user1@gmail.com' && password === 'Password123') {
     
            const { data, error } = await supabase
            .from('auth_workaround')
            .update({ logged_in_currently: 'user1@gmail.com' })
            .eq('id', 1)
            
            window.location.href = '/qu_select'; //using this instead of router.push to force rerender (cuz of auth workaround)
            return;
        }

        if (email === 'user2@gmail.com' && password === 'Password123') {

            const { data, error } = await supabase
            .from('auth_workaround')
            .update({ logged_in_currently: 'user2@gmail.com' })
            .eq('id', 1)
            
            window.location.href = '/qu_select'; //using this instead of router.push to force rerender (cuz of auth workaround)
            return;
        }
        
        alert('Login failed');
    }

    return (

        <div className="flex flex-col justify-center w-48 mx-auto py-16 ">

            <p className='text-center text-4xl mb-10 font-bold'>Login</p>

            <p>Email</p>
            <input onChange={(e) => setEmail(e.target.value)} className="p-1 rounded-md mb-2"/>

            <p>Password</p>
            <input type='password' onChange={(e) => setPassword(e.target.value)} className="p-1 rounded-md "/>

            <button 
                className='bg-cyan-700 hover:bg-cyan-600 text-white w-48 rounded-md py-1  font-bold mx-auto mt-5'
                onClick={handleSubmit}
            >
                Log in
            </button>

            <div className='flex flex-col text-xs mt-4 text-center'>
                <p className='font-bold'>User 1:</p>  
                <p>email: user1@gmail.com</p>
                <p>password: Password123</p>
                <p className="mt-3 font-bold">User 2:</p>
                <p>email: user2@gmail.com</p>
                <p>Password: Password123</p>
                <p className="mt-3 font-bold">Admin:</p>
                <p>email: admin@bioverse.com</p>
                <p>Password: Password123</p>
            </div>

        </div>

    );

}