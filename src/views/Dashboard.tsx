import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ShoppingCart,
  Users,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard: React.FC = () => {
  const { products, customers, transactions, setActiveView, triggerAiForecast, theme } = useApp();

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date.startsWith(todayStr));
  
  const todaySales = todayTransactions.reduce((acc, t) => acc + t.total, 0);
  const todayProfit = todayTransactions.reduce((acc, t) => acc + t.profit, 0);
  
  const totalUdhaar = customers.reduce((acc, c) => acc + c.pendingAmount, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);

  // Chart Data: Last 7 Days
  const chartData = [
    { name: '16 Jul', sales: 2400, profit: 450 },
    { name: '17 Jul', sales: 3200, profit: 600 },
    { name: '18 Jul', sales: 2800, profit: 510 },
    { name: '19 Jul', sales: 4500, profit: 900 },
    { name: '20 Jul', sales: 3900, profit: 780 },
    { name: '21 Jul', sales: 5200, profit: 1040 },
    { name: 'Today', sales: todaySales > 0 ? todaySales : 3500, profit: todayProfit > 0 ? todayProfit : 700 }
  ];

  // Top selling products based on transaction history or mocked popularity
  const topProducts = [
    { name: 'Maggi Masala Noodles', sales: '84 packs', revenue: '₹1,176', pct: 90 },
    { name: 'Fortune Mustard Oil 1L', sales: '45 packets', revenue: '₹7,875', pct: 75 },
    { name: 'Amul Butter 100g', sales: '32 packs', revenue: '₹1,792', pct: 60 },
    { name: 'Aashirvaad Atta 5kg', sales: '18 bags', revenue: '₹4,680', pct: 45 },
  ];

  // Format payment method
  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'cash':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Cash</span>;
      case 'upi':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">UPI</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">Udhaar</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* AI Assistant Banner */}
      <div className={`p-6 rounded-3xl relative overflow-hidden border ${
        theme === 'dark'
          ? 'bg-slate-900 border-border-dark text-white'
          : 'bg-orange-500 border-orange-600 text-white'
      } shadow-lg shadow-orange-500/10`}>
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <Sparkles size={12} className="animate-spin" />
              AI Smart Business Insights
            </div>
            <h3 className="font-display font-bold text-xl md:text-2xl">
              Monsoon demand starting? Stock up on beverages and noodles.
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-orange-100'}`}>
              Our AI forecast predicts a 35% sales increase for instant foods over the next 10 days.
            </p>
          </div>
          <div className="shrink-0 flex gap-3">
            <button 
              onClick={triggerAiForecast}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all ${
                theme === 'dark' 
                  ? 'bg-primary text-white hover:bg-primary-soft shadow-orange-500/10' 
                  : 'bg-white text-primary hover:bg-orange-50 shadow-black/5'
              }`}
            >
              <Zap size={16} />
              Run Demand Forecast
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Today Sales */}
        <div className={`p-5 rounded-2xl border transition-all ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Sales</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary">
              <ShoppingCart size={16} />
            </div>
          </div>
          <h4 className="text-xl md:text-2xl font-bold font-display flex items-baseline gap-0.5">
            <span className="text-sm font-medium text-slate-400">₹</span>
            {todaySales > 0 ? todaySales.toLocaleString('en-IN') : '3,500'}
          </h4>
          <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5 mt-1.5">
            <ArrowUpRight size={10} /> +12.4% vs Yesterday
          </span>
        </div>

        {/* Card 2: Today Profit */}
        <div className={`p-5 rounded-2xl border transition-all ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Profit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={16} />
            </div>
          </div>
          <h4 className="text-xl md:text-2xl font-bold font-display flex items-baseline gap-0.5">
            <span className="text-sm font-medium text-slate-400">₹</span>
            {todayProfit > 0 ? todayProfit.toLocaleString('en-IN') : '700'}
          </h4>
          <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5 mt-1.5">
            <ArrowUpRight size={10} /> +8.2% margin up
          </span>
        </div>

        {/* Card 3: Pending Udhaar */}
        <div className={`p-5 rounded-2xl border transition-all ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Udhaar</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
              <Users size={16} />
            </div>
          </div>
          <h4 className="text-xl md:text-2xl font-bold font-display flex items-baseline gap-0.5 text-red-500">
            <span className="text-sm font-medium text-red-400">₹</span>
            {totalUdhaar.toLocaleString('en-IN')}
          </h4>
          <button 
            onClick={() => setActiveView('udhaar')}
            className="text-[10px] font-semibold text-slate-400 hover:text-primary flex items-center gap-0.5 mt-1.5"
          >
            Manage Book <ArrowRight size={8} />
          </button>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className={`p-5 rounded-2xl border transition-all ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Items</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              lowStockCount > 0 ? 'bg-amber-500/15 text-amber-500' : 'bg-slate-500/10 text-slate-400'
            }`}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <h4 className={`text-xl md:text-2xl font-bold font-display ${lowStockCount > 0 ? 'text-amber-500' : ''}`}>
            {lowStockCount}
          </h4>
          <button 
            onClick={() => setActiveView('inventory')}
            className="text-[10px] font-semibold text-slate-400 hover:text-primary flex items-center gap-0.5 mt-1.5"
          >
            View Items <ArrowRight size={8} />
          </button>
        </div>

        {/* Card 5: Total Inventory */}
        <div className={`p-5 rounded-2xl border transition-all ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3 text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Value</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Package size={16} />
            </div>
          </div>
          <h4 className="text-xl md:text-2xl font-bold font-display flex items-baseline gap-0.5">
            <span className="text-sm font-medium text-slate-400">₹</span>
            {totalInventoryValue.toLocaleString('en-IN')}
          </h4>
          <span className="text-[10px] font-semibold text-slate-400 flex items-center mt-1.5">
            {products.length} categories active
          </span>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveView('pos')}
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-soft hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-orange-500/10"
        >
          <Plus size={18} />
          New Sale (POS)
        </button>
        <button
          onClick={() => setActiveView('udhaar')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl border font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
            theme === 'dark' ? 'bg-card-dark border-border-dark hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users size={18} className="text-slate-400" />
          Add / Manage Credit
        </button>
        <button
          onClick={() => setActiveView('inventory')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl border font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
            theme === 'dark' ? 'bg-card-dark border-border-dark hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Package size={18} className="text-slate-400" />
          Update Inventory
        </button>
        <button
          onClick={() => setActiveView('reports')}
          className={`flex items-center justify-center gap-2 p-4 rounded-2xl border font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
            theme === 'dark' ? 'bg-card-dark border-border-dark hover:bg-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText size={18} className="text-slate-400" />
          Download Reports
        </button>
      </div>

      {/* Grid: Charts & Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend Chart */}
        <div className={`p-6 rounded-3xl border lg:col-span-2 transition-all ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-base md:text-lg">Revenue Trend</h3>
              <p className="text-xs text-slate-400">Daily sales and profit trajectory</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 bg-primary rounded-xs" /> Sales
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> Profit
              </span>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2A2A2A' : '#E5E7EB'} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#2A2A2A' : '#E5E7EB',
                    borderRadius: '12px',
                    color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#F97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className={`p-6 rounded-3xl border transition-all ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-display font-bold text-base md:text-lg mb-1">Top Selling Products</h3>
          <p className="text-xs text-slate-400 mb-6">Fastest moving items this week</p>

          <div className="space-y-4">
            {topProducts.map((p, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate pr-4">{p.name}</span>
                  <span className="font-bold shrink-0">{p.revenue}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{p.sales}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${p.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className={`p-6 rounded-3xl border transition-all ${
        theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-base md:text-lg">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest checkouts and ledger logs</p>
          </div>
          <button 
            onClick={() => setActiveView('reports')}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View all logs <ArrowRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="text-slate-400 border-b border-inherit text-xs font-semibold uppercase tracking-wider pb-3">
                <th className="py-3">TX ID</th>
                <th>Time & Date</th>
                <th>Details</th>
                <th>Payment</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="text-sm font-medium hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <td className="py-4 font-mono text-slate-400 text-xs">{t.id.slice(-8).toUpperCase()}</td>
                  <td className="text-xs text-slate-500">
                    {new Date(t.date).toLocaleString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </td>
                  <td>
                    <div className="font-semibold text-xs md:text-sm line-clamp-1 max-w-[200px]">
                      {t.items.map(item => `${item.name} (x${item.qty})`).join(', ')}
                    </div>
                    {t.customerName && (
                      <span className="text-[10px] text-slate-400">Linked to: {t.customerName}</span>
                    )}
                  </td>
                  <td>{getPaymentBadge(t.paymentMethod)}</td>
                  <td className="text-right font-bold text-base">₹{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
