import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '@/services/auth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Signup(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault(); setErr('')
    try{
      await signup({ name, email, password })
      nav('/login')
    }catch(e){ setErr(e.response?.data?.message || e.message || 'Signup failed') }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 auth-hero-2"></div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md card">
          <h2 className="text-2xl font-bold mb-4">Create your account</h2>
          <p className="text-sm text-gray-500 mb-4">Get started with TX Dashboard</p>
          {err && <div className="text-red-600 mb-2">{err}</div>}
          <form onSubmit={submit} className="space-y-3">
            <Input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Full name" required />
            <Input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required />
            <Input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required minLength={6} />
            <Button className="btn-primary w-full" type="submit">Sign Up</Button>
          </form>
          <div className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-indigo-600">Sign in</Link></div>
        </div>
      </div>
    </div>
  )
}
