import { Search } from 'lucide-react'
export default function Topbar(){
  return (
    <header className="topbar">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <input className="input pl-10" placeholder="Search transactions..." />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button className="btn">Export</button>
      </div>
    </header>
  )
}
