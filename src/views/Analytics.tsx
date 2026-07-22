import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';

const Analytics: React.FC = () => {
  const { theme, triggerAiForecast } = useApp();

  // Pie chart category split
  const categorySplitData = [
    { name: 'Packaged Food', value: 1200, color: '#F97316' },
    { name: 'Cooking Essentials', value: 3400, color: '#FB923C' },
    { name: 'Dairy & Bread', value: 1500, color: '#FDBA74' },
    { name: 'Snacks & Beverages', value: 2200, color: '#FED7AA' },
    { name: 'Household & Personal', value: 1800, color: '#FFEDD5' }
  ];

  // AI Forecast Data (Historical vs Projective)
  const forecastData = [
    { day: 'Mon', actual: 3100, predicted: 3100 },
    { day: 'Tue', actual: 3400, predicted: 3350 },
    { day: 'Wed', actual: 3200, predicted: 3250 },
    { day: 'Thu', actual: 4100, predicted: 4000 },
    { day: 'Fri', actual: 4600, predicted: 4500 },
    { day: 'Sat', actual: 5200, predicted: 5100 },
    { day: 'Sun (Proj)', actual: null, predicted: 6200 },
    { day: 'Mon (Proj)', actual: null, predicted: 5800 }
  ];

  // Reorder Suggestions
  const reorderSuggestions = [
    { name: 'Maggi Masala Noodles', stock: 12, speed: 'Fast', suggest: 50, supplier: 'Nestle Ltd' },
    { name: 'Dettol Handwash Refill', stock: 4, speed: 'Medium', suggest: 20, supplier: 'Reckitt' },
    { name: 'Aashirvaad Atta 5kg', stock: 8, speed: 'Fast', suggest: 15, supplier: 'ITC Supply' }
  ];

  // Business Insights
  const businessTips = [
    {
      title: 'Monsoon Basket Bundling',
      desc: 'Bundle Tea packets (Taj Mahal) with Britannia Marie Gold biscuits at a 5% discount. Customers frequently buy them together on rainy evenings.',
      impact: 'High Impact'
    },
    {
      title: 'Optimal Inventory Allocation',
      desc: 'Reduce shelf space for cold drinks by 10% next month. Historical data suggests a soft drink sales decline as cooler temperatures begin.',
      impact: 'Medium Impact'
    },
    {
      title: 'UPI Payment Encouragement',
      desc: 'Offering QR checkout at counter reduced average checkout queue times by 35 seconds per customer. Keep QR code highly visible.',
      impact: 'Process Optimization'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* AI banner */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-orange-50 border-orange-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-primary shrink-0">
            <BrainCircuit size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base md:text-lg">KiranaAI Business Engine</h3>
            <p className="text-xs text-slate-400">Predictive stock modeling, demand forecasts, and margin optimization.</p>
          </div>
        </div>
        <button
          onClick={triggerAiForecast}
          className="px-5 py-2.5 bg-primary hover:bg-primary-soft text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/10 self-start md:self-auto"
        >
          <RefreshCw size={14} />
          Refresh Forecast Model
        </button>
      </div>

      {/* Demand projections and Sales Category splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Demand Projections Chart */}
        <div className={`p-6 rounded-3xl border transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className="font-display font-bold text-base md:text-lg">AI Demand Projection</h3>
            <p className="text-xs text-slate-400 mb-6">Historical sales comparison against forecasted monsoon projections</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2A2A2A' : '#E5E7EB'} />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Sales (₹)" stroke="#F97316" strokeWidth={3} activeDot={{ r: 6 }} connectNulls />
                <Line type="monotone" dataKey="predicted" name="AI Predicted Demand (₹)" stroke="#A855F7" strokeWidth={2.5} strokeDasharray="5 5" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Split Chart */}
        <div className={`p-6 rounded-3xl border transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className="font-display font-bold text-base md:text-lg">Revenue Split by Category</h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold">Which segments contribute most to sales revenue</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySplitData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categorySplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#2A2A2A' : '#E5E7EB',
                      borderRadius: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom legends */}
            <div className="space-y-2">
              {categorySplitData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate max-w-[120px]">{cat.name}</span>
                  </span>
                  <span className="font-mono">₹{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Reorder Predictions and AI Business tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reorder Suggestions */}
        <div className={`p-6 rounded-3xl border lg:col-span-2 transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base md:text-lg">Smart Reorder Suggestions</h3>
              <p className="text-xs text-slate-400">Products requiring immediate supplier replenishment</p>
            </div>
          </div>

          <div className="space-y-3">
            {reorderSuggestions.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 font-medium ${
                  theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm block">{item.name}</h4>
                  <span className="text-[10px] text-slate-400">Supplier: {item.supplier}</span>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Current Stock</span>
                    <span className="text-xs font-bold text-red-500">{item.stock} left</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Velocity</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-500/10 text-primary">{item.speed}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">AI Replenish</span>
                    <span className="text-xs font-bold text-emerald-500 font-mono">+{item.suggest} pcs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Business Tips */}
        <div className={`p-6 rounded-3xl border transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-primary" size={18} />
            <h3 className="font-display font-bold text-base md:text-lg">AI Merchant Advisory</h3>
          </div>

          <div className="space-y-4">
            {businessTips.map((tip, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary">{tip.title}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    tip.impact.includes('High') 
                      ? 'bg-red-500/10 text-red-500' 
                      : tip.impact.includes('Medium') 
                        ? 'bg-amber-500/10 text-amber-500' 
                        : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {tip.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
