import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  User, 
  QrCode, 
  CreditCard, 
  Printer
} from 'lucide-react';

const POS: React.FC = () => {
  const { 
    products, 
    cart, 
    customers, 
    addToCart, 
    removeFromCart, 
    updateCartQty, 
    completeCheckout, 
    clearCart,
    theme,
    shopProfile
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'udhaar'>('cash');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  
  // Checkout Modal / Invoice preview
  const [showInvoice, setShowInvoice] = useState(false);
  const [completedTx, setCompletedTx] = useState<any | null>(null);

  const categories = ['All', 'Packaged Food', 'Cooking Essentials', 'Dairy & Bread', 'Snacks & Beverages', 'Personal Care', 'Household Care'];

  // Catalog items filtering (only show items in stock)
  const catalogItems = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory && p.stock > 0;
  });

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'udhaar' && !selectedCustomerId) {
      alert('Please select a customer for Udhaar credit transactions.');
      return;
    }

    const res = completeCheckout(paymentMethod, paymentMethod === 'udhaar' ? selectedCustomerId : null);
    if (res.success && res.transaction) {
      setCompletedTx(res.transaction);
      setShowInvoice(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Product Catalog - Left side (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Search & Category Filter */}
        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products to add..."
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : theme === 'dark' 
                      ? 'bg-slate-900 text-slate-400 hover:text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {catalogItems.length === 0 ? (
            <div className={`col-span-full py-12 text-center text-slate-400 rounded-2xl border border-dashed ${
              theme === 'dark' ? 'border-border-dark bg-card-dark/30' : 'border-slate-200 bg-white'
            }`}>
              <ShoppingCart size={32} className="mx-auto opacity-10 mb-2" />
              <p className="text-sm font-semibold">No products available</p>
              <p className="text-xs">Adjust filters or restock inventory.</p>
            </div>
          ) : (
            catalogItems.map((p) => {
              const inCartItem = cart.find(item => item.product.id === p.id);
              const qtyInCart = inCartItem ? inCartItem.qty : 0;
              const remainingStock = p.stock - qtyInCart;

              return (
                <button
                  key={p.id}
                  disabled={remainingStock <= 0}
                  onClick={() => addToCart(p, 1)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 relative overflow-hidden transition-all group cursor-pointer ${
                    remainingStock <= 0
                      ? 'opacity-50 cursor-not-allowed border-dashed'
                      : 'hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                  } ${
                    theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Badge quantity indicator */}
                  {qtyInCart > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full">
                      {qtyInCart}
                    </span>
                  )}
                  <span className="text-2xl">{p.image}</span>
                  <div className="space-y-1">
                    <span className="text-xs md:text-sm font-bold block line-clamp-2 leading-tight">
                      {p.name}
                    </span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-bold font-mono text-primary">₹{p.price}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{remainingStock} left</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Shopping Cart - Right side (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className={`p-6 rounded-3xl border flex flex-col h-[520px] transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
            <div className="flex items-center gap-2 font-display font-bold">
              <ShoppingCart className="text-primary" size={20} />
              <h4>Checkout Cart</h4>
            </div>
            {cart.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-xs text-red-500 font-semibold hover:underline"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart item listing */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <ShoppingCart size={40} className="opacity-10 mb-3" />
                <p className="text-sm font-semibold">Cart is empty</p>
                <p className="text-xs">Tap items on the left to add them here.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.product.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs md:text-sm font-bold block truncate">{item.product.name}</span>
                    <span className="text-xs text-slate-400 font-mono">₹{item.product.price} / {item.product.unit}</span>
                  </div>

                  {/* Quantity adjustments */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.qty - 1)}
                      className={`p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
                        theme === 'dark' ? 'border-border-dark' : 'border-slate-200'
                      }`}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center font-mono">{item.qty}</span>
                    <button
                      onClick={() => addToCart(item.product, 1)}
                      className={`p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
                        theme === 'dark' ? 'border-border-dark' : 'border-slate-200'
                      }`}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method selector */}
          <div className="border-t border-inherit pt-4 mt-4 space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : theme === 'dark' ? 'bg-slate-900 border-border-dark text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <CreditCard size={12} />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : theme === 'dark' ? 'bg-slate-900 border-border-dark text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <QrCode size={12} />
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod('udhaar')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'udhaar'
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : theme === 'dark' ? 'bg-slate-900 border-border-dark text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <User size={12} />
                  Udhaar
                </button>
              </div>
            </div>

            {/* Customer selector (only for Udhaar) */}
            {paymentMethod === 'udhaar' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Link to Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-primary ${
                    theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (Outstanding: ₹{c.pendingAmount})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Calculations and Complete button */}
            <div className="flex justify-between items-center text-sm font-semibold pt-2">
              <span className="text-slate-400">Total Items:</span>
              <span className="font-bold">{cart.reduce((acc, item) => acc + item.qty, 0)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-base font-bold">Total Amount:</span>
              <span className="text-2xl font-extrabold font-display text-primary flex items-baseline">
                <span className="text-lg font-medium pr-0.5">₹</span>
                {cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                cart.length === 0
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed opacity-50 shadow-none'
                  : 'bg-primary hover:bg-primary-soft hover:scale-[1.01] active:scale-[0.99] shadow-orange-500/10 cursor-pointer'
              }`}
            >
              <Check size={18} />
              Complete Sale
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {showInvoice && completedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowInvoice(false)} />
          
          <div className={`relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border p-6 ${
            theme === 'dark' ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-white text-text-light border-slate-200'
          }`}>
            {/* Header info */}
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-200 dark:border-border-dark">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-display font-extrabold text-xl mx-auto shadow-md shadow-orange-500/15">
                K
              </div>
              <h3 className="font-display font-bold text-lg text-primary">{shopProfile.name}</h3>
              <p className="text-[10px] text-slate-400 leading-normal max-w-[200px] mx-auto">{shopProfile.address}</p>
              <p className="text-[10px] text-slate-400 font-mono">Ph: {shopProfile.phone}</p>
            </div>

            {/* Order details */}
            <div className="py-4 space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-slate-400 font-mono">
                <span>TX: {completedTx.id.slice(-8).toUpperCase()}</span>
                <span>{new Date(completedTx.date).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>Payment: <span className="uppercase">{completedTx.paymentMethod}</span></span>
                {completedTx.customerName && (
                  <span>Cust: {completedTx.customerName}</span>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border-t border-b border-dashed border-slate-200 dark:border-border-dark py-3 space-y-2">
              {completedTx.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-xs font-medium">
                  <span className="truncate pr-4">{item.name} x {item.qty}</span>
                  <span className="font-mono">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Total display */}
            <div className="py-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm">Grand Total:</span>
                <span className="text-xl font-black font-display text-primary">₹{completedTx.total}</span>
              </div>

              {/* QR Code for UPI */}
              {completedTx.paymentMethod === 'upi' && (
                <div className="p-3 rounded-2xl bg-white border border-slate-100 flex flex-col items-center gap-1.5 shadow-xs">
                  {/* Generated QR Code from a standard API showing UPI transaction flow */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=upi://pay?pa=${shopProfile.upiId}%26pn=${encodeURIComponent(shopProfile.name)}%26am=${completedTx.total}%26cu=INR`} 
                    alt="UPI Payment QR Code" 
                    className="w-28 h-28"
                  />
                  <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase font-mono">Scan QR to pay ₹{completedTx.total}</span>
                </div>
              )}
            </div>

            {/* Print & Close buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handlePrint}
                className={`py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  theme === 'dark' ? 'border-border-dark bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <Printer size={14} />
                Print Receipt
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-soft flex items-center justify-center gap-1 transition-all cursor-pointer shadow-md shadow-orange-500/10"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default POS;
