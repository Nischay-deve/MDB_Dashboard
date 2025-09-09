import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '@/services/auth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault(); setErr('')
    try{
      const res = await login({ email, password })
      const token = res.data.token || res.data.accessToken || res.data
      if (!token) throw new Error('No token')
      localStorage.setItem('token', token)
      nav('/')
    }catch(e){ setErr(e.response?.data?.message || e.message || 'Login failed') }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 auth-hero"></div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md card">
          <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-4">Sign in to continue to TX Dashboard</p>
          {err && <div className="text-red-600 mb-2">{err}</div>}
          <form onSubmit={submit} className="space-y-3">
            <Input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required />
            <Input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required minLength={6} />
            <Button className="btn-primary w-full" type="submit">Sign In</Button>
          </form>
          <div className="mt-4 text-sm">Don't have an account? <Link to="/signup" className="text-indigo-600">Sign up</Link></div>
        </div>
      </div>
    </div>
  )
}
