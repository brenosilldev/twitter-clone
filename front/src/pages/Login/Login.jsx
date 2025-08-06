import React from 'react'

const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col items-center justify-center gap-3 w-full max-w-xs bg-red-500 p-4 rounded-md'>
            <h1 className='text-2xl font-bold'>Login</h1>
            <input type="text" placeholder='Email' className='input input-bordered w-full max-w-xs' />
            <input type="password" placeholder='Password' className='input input-bordered w-full max-w-xs' />
            <button className='btn btn-primary'>Login</button>
        </div>
    </div>
  )
}

export default Login