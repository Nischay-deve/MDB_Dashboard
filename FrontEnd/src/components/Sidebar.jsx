import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, LogOut } from 'lucide-react'
export default function Sidebar(){
  return (
    <aside className="layout-sidebar">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="h-10 w-10 rounded bg-indigo-600" />
        <div>
          <div className="font-semibold">TX Dashboard</div>
          <div className="text-xs text-white/60">Admin</div>
        </div>
      </div>
      <nav className="p-3 space-y-1 flex-1">
        <NavLink to="/" end className={({isActive})=> isActive? 'block p-3 rounded bg-indigo-600' : 'block p-3 hover:bg-white/5'}>
          <LayoutDashboard className="inline mr-2"/> Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({isActive})=> isActive? 'block p-3 rounded bg-indigo-600' : 'block p-3 hover:bg-white/5'}>
          <FileText className="inline mr-2"/> Transactions
        </NavLink>
        <NavLink to="/users" className={({isActive})=> isActive? 'block p-3 rounded bg-indigo-600' : 'block p-3 hover:bg-white/5'}>
          <Users className="inline mr-2"/> Users
        </NavLink>
      </nav>
      <div className="p-4 border-t border-white/10">
        <button className="btn w-full" onClick={()=>{ localStorage.removeItem('token'); window.location.href = '/login'; }}><LogOut/> Logout</button>
      </div>
    </aside>
  )
}
