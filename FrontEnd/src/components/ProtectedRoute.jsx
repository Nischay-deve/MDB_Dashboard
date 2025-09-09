import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function ProtectedRoute(){
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
