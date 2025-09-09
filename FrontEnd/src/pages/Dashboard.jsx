import Card from '@/components/ui/Card'
export default function Dashboard(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome Back 👋</h1>
      <p className="text-gray-500 mb-6">Here's a quick overview of your account</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><div className="text-sm text-gray-500">Balance</div><div className="text-2xl font-bold">₹ 12,450</div></Card>
        <Card><div className="text-sm text-gray-500">Transactions</div><div className="text-2xl font-bold">1,234</div></Card>
        <Card><div className="text-sm text-gray-500">Active Users</div><div className="text-2xl font-bold">987</div></Card>
        <Card><div className="text-sm text-gray-500">Conversion</div><div className="text-2xl font-bold">6.2%</div></Card>
      </div>
    </div>
  )
}
