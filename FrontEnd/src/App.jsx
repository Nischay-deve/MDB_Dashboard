import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Dashboard from '@/pages/Dashboard'
import Transactions from '@/pages/Transactions'
import Users from '@/pages/Users'

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/*" element={<ProtectedRoute/>}>
        <Route index element={<Dashboard/>} />
        <Route path="transactions" element={<Transactions/>} />
        <Route path="users" element={<Users/>} />
      </Route>
    </Routes>
  )
}
