import React, { useState }  from "react";
import axios from "axios";
import Link from 'next/Link'
import toast, { ToastBar } from "react-hot-toast";
export default function ProfilePage() {
    const router = useRouter()
    const [data, setdata] = useState ("nothing")
   
    const getUserDetails = async() => {
        await axios.post("/app/api/users/me")
        console.log(res.data);
        setdata(res.data._id)
    }

    const logout = async() => {
        try {
            await axios.get('/app/api/users/logout')
            toast.success("logout success")
            router.push("/app/login ")
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }
    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-2'>
            <h1>Profile Page</h1>
            <hr/>
            <h2>{data === "nothing" ? "Nothing" : <Link href =
            {`/profile/${data}`} > {data}</Link>}</h2>
            <hr/>
            <button
            className='bg-bue-500 mt-4 hover:bg-blue-700
            text-white fon-bold py-2 px-4 rounded'
            onClick={logout}
            >Logout</button>

            <button
            className='bg-red-500 mt-4 hover:bg-red-700
            text-white fon-bold py-2 px-4 rounded'
            onClick={getUserDetails}
            >Get User Details</button>

        </div>
    )
}