import React, { useState } from 'react';
import { useApp, type Customer } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Check, 
  Clock, 
  ChevronRight, 
  X, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  History
} from 'lucide-react';

const Udhaar: React.FC = () => {
  const { customers, addCustomer, addUdhaar, payUdhaar, theme, shopProfile } = useApp();

  // Search & Tab States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'overdue'>('all');

  // Selected Customer Details Modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modals state
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerDueDate, setCustomerDueDate] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState('');
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditNote, setCreditNote] = useState('');

  // Calculations
  const totalOutstanding = customers.reduce((acc, c) => acc + c.pendingAmount, 0);
  const totalPendingCustomersCount = customers.filter(c => c.pendingAmount > 0).length;

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.phone.includes(searchTerm);
    
    let matchesTab = true;
    if (activeTab === 'pending') {
      matchesTab = c.pendingAmount > 0;
    } else if (activeTab === 'overdue') {
      matchesTab = c.pendingAmount > 0 && c.dueDate < todayStr;
    }

    return matchesSearch && matchesTab;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    addCustomer({
      name: customerName,
      phone: customerPhone,
      dueDate: customerDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // default 1 week
    });

    setCustomerName('');
    setCustomerPhone('');
    setCustomerDueDate('');
    setShowAddCustomerModal(false);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || paymentAmount <= 0) return;

    payUdhaar(selectedCustomer.id, paymentAmount, paymentNote || 'Cash payment received');
    
    // Update local modal state immediately
    const updated = customers.find(c => c.id === selectedCustomer.id);
    if (updated) {
      // Calculate optimistic update
      const nextPending = Math.max(0, updated.pendingAmount - paymentAmount);
      setSelectedCustomer({
        ...updated,
        pendingAmount: nextPending,
        history: [{
          id: 'temp',
          type: 'payment',
          amount: paymentAmount,
          date: todayStr,
          note: paymentNote || 'Cash payment received'
        }, ...updated.history]
      });
    }

    setPaymentAmount(0);
    setPaymentNote('');
    setShowPaymentModal(false);
  };

  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || creditAmount <= 0) return;

    addUdhaar(selectedCustomer.id, creditAmount, creditNote || 'Credit purchase');

    // Update local modal state immediately
    const updated = customers.find(c => c.id === selectedCustomer.id);
    if (updated) {
      const nextPending = updated.pendingAmount + creditAmount;
      setSelectedCustomer({
        ...updated,
        pendingAmount: nextPending,
        history: [{
          id: 'temp',
          type: 'credit',
          amount: creditAmount,
          date: todayStr,
          note: creditNote || 'Credit purchase'
        }, ...updated.history]
      });
    }

    setCreditAmount(0);
    setCreditNote('');
    setShowCreditModal(false);
  };

  // WhatsApp Reminder Link Generator
  const getWhatsAppLink = (c: Customer) => {
    const message = `Namaste ${c.name} ji, this is a friendly reminder from ${shopProfile.name}. Your outstanding balance of ₹${c.pendingAmount} is due. Please pay online via UPI to ${shopProfile.upiId} or visit the shop. Dhanyawad!`;
    return `https://wa.me/91${c.phone}?text=${encodeURIComponent(message)}`;
  };

  const getRiskColor = (status: Customer['riskStatus']) => {
    switch (status) {
      case 'high':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
  };

  const isOverdue = (dateStr: string) => {
    return dateStr < todayStr;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner KPI / Add action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Outstanding credit KPI */}
        <div className={`p-5 rounded-2xl border flex items-center gap-4 transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <DollarSign size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Outstanding Credit</span>
            <span className="text-2xl font-black font-display text-red-500">₹{totalOutstanding.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Pending customers KPI */}
        <div className={`p-5 rounded-2xl border flex items-center gap-4 transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-primary flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Pending Accounts</span>
            <span className="text-2xl font-bold font-display">{totalPendingCustomersCount} customers</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="flex items-center justify-center gap-2 p-5 rounded-2xl bg-primary text-white font-bold hover:bg-primary-soft hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-orange-500/10"
        >
          <Plus size={20} />
          Create Customer Ledger
        </button>
      </div>

      {/* Filter and search block */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-3 transition-colors ${
        theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
      }`}>
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name or phone..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-primary ${
              theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>

        {/* Tab Toggle */}
        <div className={`flex rounded-xl p-0.5 border ${
          theme === 'dark' ? 'border-border-dark bg-slate-900' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            All Book
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Pending Credit
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overdue' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Overdue Dues
          </button>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className={`col-span-full py-16 text-center text-slate-400 rounded-3xl border border-dashed ${
            theme === 'dark' ? 'border-border-dark bg-card-dark/30' : 'border-slate-200 bg-white'
          }`}>
            <Users className="mx-auto opacity-15 mb-2" size={48} />
            <p className="font-semibold text-sm">No customers matching search criteria</p>
            <p className="text-xs">Add a new customer ledger using the button above.</p>
          </div>
        ) : (
          filteredCustomers.map((c) => (
            <div 
              key={c.id}
              className={`p-5 rounded-2xl border transition-all hover:shadow-md ${
                theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center font-bold text-primary`}>
                    {c.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm block leading-none">{c.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">Ph: {c.phone}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border uppercase ${getRiskColor(c.riskStatus)}`}>
                  {c.riskStatus} Risk
                </span>
              </div>

              {/* Dues Details */}
              <div className="flex justify-between items-baseline mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Outstanding amount</span>
                  <span className={`text-xl font-extrabold font-display ${c.pendingAmount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    ₹{c.pendingAmount}
                  </span>
                </div>
                {c.pendingAmount > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Due Date</span>
                    <span className={`text-xs font-semibold flex items-center gap-1 font-mono justify-end ${
                      isOverdue(c.dueDate) ? 'text-red-500 font-bold' : ''
                    }`}>
                      {isOverdue(c.dueDate) && <Clock size={12} className="text-red-500 shrink-0" />}
                      {new Date(c.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Action shortcuts */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-border-dark/60">
                {c.pendingAmount > 0 ? (
                  <>
                    <a
                      href={getWhatsAppLink(c)}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageSquare size={12} />
                      Send Alert
                    </a>
                    <button
                      onClick={() => { setSelectedCustomer(c); setShowPaymentModal(true); }}
                      className="py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-soft flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs shadow-orange-500/10"
                    >
                      <Check size={12} />
                      Collect Cash
                    </button>
                  </>
                ) : (
                  <span className="col-span-2 text-center py-2 text-xs font-bold text-emerald-500 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> Clear Account
                  </span>
                )}
              </div>

              {/* View Ledger Details Link */}
              <button 
                onClick={() => setSelectedCustomer(c)}
                className="w-full text-center text-xs text-slate-400 font-bold hover:text-primary mt-3 flex items-center justify-center gap-0.5"
              >
                <History size={12} /> View Complete Ledger <ChevronRight size={10} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Ledger History Overlay Drawer */}
      {selectedCustomer && !showPaymentModal && !showCreditModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setSelectedCustomer(null)} />
          
          <div className={`relative w-full max-w-lg h-full flex flex-col shadow-2xl transition-all duration-300 ${
            theme === 'dark' ? 'bg-card-dark text-text-dark border-l border-border-dark' : 'bg-white text-text-light'
          }`}>
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center font-bold text-primary">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base md:text-lg">{selectedCustomer.name}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">Ph: {selectedCustomer.phone}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Total Balance / Action shortcuts inside drawer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Outstanding Balance</span>
                <span className={`text-2xl font-black font-display ${selectedCustomer.pendingAmount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  ₹{selectedCustomer.pendingAmount}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="px-4 py-2 border border-red-500/20 bg-red-500/5 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500/10 cursor-pointer"
                >
                  + Add Credit
                </button>
                {selectedCustomer.pendingAmount > 0 && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-soft cursor-pointer shadow-xs"
                  >
                    Receive Cash
                  </button>
                )}
              </div>
            </div>

            {/* Ledger Listing */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction History</h4>
              
              {selectedCustomer.history.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <p className="font-semibold text-sm">No ledger entries yet</p>
                  <p className="text-xs">Perform a POS sale or add credit manually.</p>
                </div>
              ) : (
                selectedCustomer.history.map((log) => (
                  <div 
                    key={log.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                      log.type === 'credit' 
                        ? 'border-red-500/10 bg-red-500/5/20' 
                        : 'border-emerald-500/10 bg-emerald-500/5/20'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                          log.type === 'credit' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {log.type === 'credit' ? 'Credit Given' : 'Paid Back'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 font-mono">{log.date}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">{log.note}</p>
                    </div>
                    <span className={`font-mono text-base font-extrabold ${
                      log.type === 'credit' ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {log.type === 'credit' ? '+' : '-'} ₹{log.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowAddCustomerModal(false)} />
          <div className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all border p-6 ${
            theme === 'dark' ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-white text-text-light border-slate-200'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-inherit mb-4">
              <h3 className="font-display font-bold">New Customer Account</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Customer Name</label>
                <input
                  type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                <input
                  type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Credit Due Date</label>
                <input
                  type="date" value={customerDueDate} onChange={(e) => setCustomerDueDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-soft transition-all shadow-md shadow-orange-500/10 cursor-pointer text-sm"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Collect Payment Cash Modal */}
      {showPaymentModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowPaymentModal(false)} />
          <div className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all border p-6 ${
            theme === 'dark' ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-white text-text-light border-slate-200'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-inherit mb-4">
              <h3 className="font-display font-bold">Collect Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
            </div>
            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Paying to: {selectedCustomer.name}</span>
                <span className="text-xs text-slate-400 font-semibold block">Outstanding balance: ₹{selectedCustomer.pendingAmount}</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Amount to pay (₹)</label>
                <input
                  type="number" min="1" max={selectedCustomer.pendingAmount} required
                  value={paymentAmount || ''} onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Remarks/Notes</label>
                <input
                  type="text" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. Paid via GPay, Cash, etc."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-soft transition-all shadow-md shadow-orange-500/10 cursor-pointer text-sm"
              >
                Record Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Credit Ledger Modal */}
      {showCreditModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowCreditModal(false)} />
          <div className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all border p-6 ${
            theme === 'dark' ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-white text-text-light border-slate-200'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-inherit mb-4">
              <h3 className="font-display font-bold">Add Manual Credit</h3>
              <button onClick={() => setShowCreditModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
            </div>
            <form onSubmit={handleCreditSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold block">Adding credit to: {selectedCustomer.name}</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Credit Amount (₹)</label>
                <input
                  type="number" min="1" required
                  value={creditAmount || ''} onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Remarks/Notes</label>
                <input
                  type="text" required value={creditNote} onChange={(e) => setCreditNote(e.target.value)}
                  placeholder="e.g. Purchased oil and spices"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-soft transition-all shadow-md shadow-orange-500/10 cursor-pointer text-sm"
              >
                Save Credit Entry
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Udhaar;
