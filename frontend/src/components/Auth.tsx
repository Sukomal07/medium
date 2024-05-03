import React, { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { SignupType } from '@sukomal07/common-app'
import axios from 'axios'

const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate()
    const [data, setData] = useState<SignupType>({
        name: "",
        email: "",
        password: ""
    })


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setData({
            ...data,
            [name]: value
        })
    }

    async function sendRequest(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            const res = axios.post(`https://backend.hypersukomal.workers.dev/api/v1/user/${type === "signup" ? "signup" : "signin"}`, data)

            toast.promise(res, {
                loading: `${type === "signup" ? "Creating account..." : "Checking credentials..."}`,
                success: (data) => {
                    localStorage.setItem("jwt", JSON.stringify(data?.data?.jwt))
                    setData({
                        name: "",
                        email: "",
                        password: ""
                    })
                    navigate("/")
                    return "Success"
                },
                error: (err) => {
                    console.log(err);
                    return err?.response?.data?.error;
                }
            });

            return (await res).data;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.message)
            } else {
                console.error(error);
            }
        }
    }



    return (
        <div className='h-screen'>
            <div className='flex flex-col gap-16 items-center justify-center h-full'>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-4xl font-extrabold'>
                        {type === "signup" ? "Create an account" : "Log In Your Account"}
                    </h1>
                    <p className='text-slate-500 font-semibold'>
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                </div>
                <form onSubmit={sendRequest} className='flex flex-col gap-4 w-[300px]'>
                    {type === "signup" ? <div className='flex flex-col gap-2'>
                        <label htmlFor="name" className="block text-xl text-slate-600 font-semibold">Name</label>
                        <input type="text" name="name" id="name" value={data.name} onChange={(e) => handleChange(e)} placeholder='Enter your name' className="bg-gray-50 border border-slate-500 text-slate-700 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    </div> : null}
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email" className="block text-xl text-slate-600 font-semibold">Email</label>
                        <input type="email" name="email" id="email" value={data.email} onChange={(e) => handleChange(e)} placeholder='m@example.com' className="bg-gray-50 border border-slate-500 text-slate-700 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="password" className="block text-xl text-slate-600 font-semibold">Password</label>
                        <input type="password" name="password" id="password" value={data.password} onChange={(e) => handleChange(e)} placeholder='12XXX6' className="bg-gray-50 border border-slate-500 text-slate-700 rounded-md outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    </div>
                    <button type='submit' className="w-full text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-md text-sm  py-2.5  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </form>
            </div>
        </div>
    )
}

export default Auth
