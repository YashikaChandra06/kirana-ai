import React, { useState } from 'react';
import { useApp, type Product } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  X,
  Package,
  Layers
} from 'lucide-react';

const Inventory: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, theme } = useApp();

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Packaged Food');
  const [formStock, setFormStock] = useState<number>(0);
  const [formMinStock, setFormMinStock] = useState<number>(5);
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formCostPrice, setFormCostPrice] = useState<number>(0);
  const [formImage, setFormImage] = useState('📦');
  const [formSupplier, setFormSupplier] = useState('');
  const [formUnit, setFormUnit] = useState('pcs');

  // Categories list
  const categories = ['All', 'Packaged Food', 'Cooking Essentials', 'Dairy & Bread', 'Snacks & Beverages', 'Personal Care', 'Household Care'];
  const emojis = ['📦', '🍜', '🧴', '🌾', '🧈', '🧂', '🧼', '🍪', '🥤', '🧺', '☕', '🍎', '🥦'];

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = p.stock <= p.minStock && p.stock > 0;
    } else if (stockFilter === 'out') {
      matchesStock = p.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const openAddModal = () => {
    setFormName('');
    setFormCategory('Packaged Food');
    setFormStock(10);
    setFormMinStock(5);
    setFormPrice(20);
    setFormCostPrice(15);
    setFormImage('📦');
    setFormSupplier('');
    setFormUnit('pcs');
    setShowAddModal(true);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addProduct({
      name: formName,
      category: formCategory,
      stock: Number(formStock),
      minStock: Number(formMinStock),
      price: Number(formPrice),
      costPrice: Number(formCostPrice),
      image: formImage,
      supplier: formSupplier || 'Local Wholesale Dealer',
      unit: formUnit
    });
    setShowAddModal(false);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormStock(p.stock);
    setFormMinStock(p.minStock);
    setFormPrice(p.price);
    setFormCostPrice(p.costPrice);
    setFormImage(p.image);
    setFormSupplier(p.supplier);
    setFormUnit(p.unit);
    setShowEditModal(true);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !formName.trim()) return;

    updateProduct(editingProduct.id, {
      name: formName,
      category: formCategory,
      stock: Number(formStock),
      minStock: Number(formMinStock),
      price: Number(formPrice),
      costPrice: Number(formCostPrice),
      image: formImage,
      supplier: formSupplier,
      unit: formUnit
    });
    setShowEditModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const getStockBadge = (stock: number, min: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">Out of Stock</span>;
    }
    if (stock <= min) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-500/15 text-amber-500 flex items-center gap-1"><AlertTriangle size={12} /> Low Stock</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-500">In Stock</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base text-slate-400">Manage store items, pricing, and view analytics.</h3>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-soft hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-orange-500/10 self-start sm:self-auto"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search and Filters panel */}
      <div className={`p-5 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products or suppliers..."
              className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`pl-11 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer font-medium ${
                theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Stock toggle filter */}
          <div className={`flex rounded-xl p-1 border ${
            theme === 'dark' ? 'border-border-dark bg-slate-900' : 'border-slate-200 bg-slate-50'
          }`}>
            <button
              onClick={() => setStockFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                stockFilter === 'all' 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                stockFilter === 'low' 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                stockFilter === 'out' 
                  ? 'bg-primary text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products list table */}
      <div className={`rounded-3xl border overflow-hidden transition-all ${
        theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b border-inherit text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50'
              }`}>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6 text-right">Cost Price</th>
                <th className="py-4 px-6 text-right">Sell Price</th>
                <th className="py-4 px-6 text-right">Profit Margin</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <Package className="mx-auto opacity-10 mb-2" size={48} />
                    <p className="font-semibold text-sm">No products found</p>
                    <p className="text-xs">Try resetting search filters or add a new product.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const profit = p.price - p.costPrice;
                  const marginPct = Math.round((profit / p.price) * 100);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all font-medium">
                      {/* Product Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'
                          }`}>
                            {p.image}
                          </div>
                          <div>
                            <span className="font-bold text-sm md:text-base block leading-tight">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{p.supplier || 'No supplier'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
                        {p.category}
                      </td>

                      {/* Stock level status */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span>{p.stock} {p.unit}</span>
                            <span>{getStockBadge(p.stock, p.minStock)}</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                p.stock === 0 
                                  ? 'bg-red-500' 
                                  : p.stock <= p.minStock 
                                    ? 'bg-amber-500' 
                                    : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${Math.min(100, (p.stock / (p.minStock * 2)) * 100)}%` }} 
                            />
                          </div>
                        </div>
                      </td>

                      {/* Cost Price */}
                      <td className="py-4 px-6 text-right font-mono font-semibold">
                        ₹{p.costPrice}
                      </td>

                      {/* Sell Price */}
                      <td className="py-4 px-6 text-right font-mono font-bold text-slate-800 dark:text-white">
                        ₹{p.price}
                      </td>

                      {/* Margin */}
                      <td className="py-4 px-6 text-right">
                        <span className="text-emerald-500 font-bold font-mono">₹{profit}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">{marginPct}% margin</span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className={`p-2 rounded-lg hover:text-primary transition-all ${
                              theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className={`p-2 rounded-lg hover:text-red-500 transition-all ${
                              theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modals */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} />
          
          <div className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border ${
            theme === 'dark' ? 'bg-card-dark text-text-dark border-border-dark' : 'bg-white text-text-light border-slate-200'
          }`}>
            <div className="p-6 border-b border-inherit flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">{showAddModal ? 'Add New Product' : 'Edit Product'}</h3>
              <button 
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddProduct : handleEditProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Fortune Mustard Oil 1L"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Emoji / Image representation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Icon</label>
                  <select
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  >
                    {emojis.map((emoji) => (
                      <option key={emoji} value={emoji}>{emoji} Icon</option>
                    ))}
                  </select>
                </div>

                {/* Cost Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Cost Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                {/* Selling Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                {/* Current Stock */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                {/* Min Stock Alert limit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Low Stock Threshold</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                {/* Unit of measure */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Unit</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="pcs, kg, packet"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                {/* Supplier name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Supplier Name</label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="Distributor / Wholesale agency"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-inherit flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border ${
                    theme === 'dark' ? 'border-border-dark bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-soft shadow-md shadow-orange-500/10"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;
