import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  costPrice: number;
  image: string;
  supplier: string;
  unit: string;
}

export interface LedgerEntry {
  id: string;
  type: 'credit' | 'payment';
  amount: number;
  date: string;
  note: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  pendingAmount: number;
  dueDate: string;
  history: LedgerEntry[];
  riskStatus: 'low' | 'medium' | 'high';
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface TransactionItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  costPrice: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  total: number;
  profit: number;
  paymentMethod: 'cash' | 'upi' | 'udhaar';
  customerId: string | null;
  customerName?: string;
  date: string;
}

export interface Notification {
  id: string;
  type: 'stock' | 'payment' | 'ai' | 'supplier';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ShopProfile {
  name: string;
  address: string;
  phone: string;
  upiId: string;
}

interface AppContextType {
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  notifications: Notification[];
  cart: CartItem[];
  shopProfile: ShopProfile;
  activeView: string;
  setActiveView: (view: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  language: 'en' | 'hi' | 'hinglish';
  setLanguage: (lang: 'en' | 'hi' | 'hinglish') => void;
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'pendingAmount' | 'history' | 'riskStatus'>) => void;
  addUdhaar: (customerId: string, amount: number, note: string) => void;
  payUdhaar: (customerId: string, amount: number, note: string) => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  completeCheckout: (paymentMethod: 'cash' | 'upi' | 'udhaar', customerId: string | null) => { success: boolean; transaction?: Transaction };
  addNotification: (type: Notification['type'], title: string, message: string) => void;
  markNotificationsAsRead: () => void;
  updateShopProfile: (profile: ShopProfile) => void;
  processVoiceCommand: (command: string) => { success: boolean; feedback: string };
  triggerAiForecast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Data
const initialProducts: Product[] = [
  { id: 'p1', name: 'Maggi Masala Noodles 2-Min', category: 'Packaged Food', stock: 12, minStock: 25, price: 14, costPrice: 11, image: '🍜', supplier: 'Nestle Distributor Ltd', unit: 'pcs' },
  { id: 'p2', name: 'Fortune Mustard Oil 1L', category: 'Cooking Essentials', stock: 45, minStock: 15, price: 175, costPrice: 155, image: '🧴', supplier: 'Adani Wilmar Agency', unit: 'packet' },
  { id: 'p3', name: 'Aashirvaad Atta Shudh Chakki 5kg', category: 'Cooking Essentials', stock: 8, minStock: 10, price: 260, costPrice: 230, image: '🌾', supplier: 'ITC Supply Corp', unit: 'bag' },
  { id: 'p4', name: 'Amul Butter 100g', category: 'Dairy & Bread', stock: 22, minStock: 8, price: 56, costPrice: 48, image: '🧈', supplier: 'Amul Cooperative Delhi', unit: 'pcs' },
  { id: 'p5', name: 'Tata Salt Lite 1kg', category: 'Cooking Essentials', stock: 50, minStock: 20, price: 28, costPrice: 22, image: '🧂', supplier: 'Tata Consumer Brands', unit: 'pcs' },
  { id: 'p6', name: 'Dettol Liquid Handwash Refill 175ml', category: 'Personal Care', stock: 4, minStock: 12, price: 99, costPrice: 82, image: '🧼', supplier: 'Reckitt Distributor', unit: 'pcs' },
  { id: 'p7', name: 'Britannia Marie Gold Biscuit 250g', category: 'Snacks & Beverages', stock: 35, minStock: 15, price: 30, costPrice: 24, image: '🍪', supplier: 'Britannia Wholesale', unit: 'pcs' },
  { id: 'p8', name: 'Coca-Cola Bottle 750ml', category: 'Snacks & Beverages', stock: 40, minStock: 15, price: 40, costPrice: 32, image: '🥤', supplier: 'Hindustan Coca-Cola Beverages', unit: 'pcs' },
  { id: 'p9', name: 'Surf Excel Easy Wash 1kg', category: 'Household Care', stock: 15, minStock: 8, price: 140, costPrice: 118, image: '🧺', supplier: 'Hindustan Unilever Ltd', unit: 'pcs' },
  { id: 'p10', name: 'Taj Mahal Tea Packet 250g', category: 'Snacks & Beverages', stock: 18, minStock: 10, price: 195, costPrice: 170, image: '☕', supplier: 'HUL Tea division', unit: 'pcs' },
];

const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Rahul Sharma',
    phone: '9876543210',
    pendingAmount: 1200,
    dueDate: '2026-07-25',
    riskStatus: 'low',
    history: [
      { id: 'l1', type: 'credit', amount: 1500, date: '2026-07-15', note: 'Aashirvaad Atta, Fortune Oil, and spices purchase' },
      { id: 'l2', type: 'payment', amount: 300, date: '2026-07-18', note: 'GPay payment' },
    ]
  },
  {
    id: 'c2',
    name: 'Suresh Patel',
    phone: '9988776655',
    pendingAmount: 450,
    dueDate: '2026-07-28',
    riskStatus: 'medium',
    history: [
      { id: 'l3', type: 'credit', amount: 450, date: '2026-07-20', note: 'Coke and Marie biscuits' }
    ]
  },
  {
    id: 'c3',
    name: 'Priya Gupta',
    phone: '9123456789',
    pendingAmount: 0,
    dueDate: '2026-08-01',
    riskStatus: 'low',
    history: [
      { id: 'l4', type: 'credit', amount: 650, date: '2026-07-10', note: 'Personal care items' },
      { id: 'l5', type: 'payment', amount: 650, date: '2026-07-12', note: 'Cash payment settled' }
    ]
  },
  {
    id: 'c4',
    name: 'Amit Verma',
    phone: '9234567890',
    pendingAmount: 2800,
    dueDate: '2026-07-10', // Overdue!
    riskStatus: 'high',
    history: [
      { id: 'l6', type: 'credit', amount: 2800, date: '2026-07-01', note: 'Bulk kitchen supplies for event' }
    ]
  }
];

const initialTransactions: Transaction[] = [
  {
    id: 't1',
    date: '2026-07-22T10:30:00Z',
    items: [
      { productId: 'p1', name: 'Maggi Masala Noodles 2-Min', qty: 5, price: 14, costPrice: 11 },
      { productId: 'p4', name: 'Amul Butter 100g', qty: 1, price: 56, costPrice: 48 }
    ],
    total: 126,
    profit: 23,
    paymentMethod: 'cash',
    customerId: null
  },
  {
    id: 't2',
    date: '2026-07-22T11:45:00Z',
    items: [
      { productId: 'p2', name: 'Fortune Mustard Oil 1L', qty: 2, price: 175, costPrice: 155 },
      { productId: 'p5', name: 'Tata Salt Lite 1kg', qty: 1, price: 28, costPrice: 22 }
    ],
    total: 378,
    profit: 46,
    paymentMethod: 'upi',
    customerId: null
  },
  {
    id: 't3',
    date: '2026-07-21T16:20:00Z',
    items: [
      { productId: 'p3', name: 'Aashirvaad Atta Shudh Chakki 5kg', qty: 1, price: 260, costPrice: 230 }
    ],
    total: 260,
    profit: 30,
    paymentMethod: 'udhaar',
    customerId: 'c1',
    customerName: 'Rahul Sharma'
  }
];

const initialNotifications: Notification[] = [
  { id: 'n1', type: 'stock', title: 'Low Stock Alert', message: 'Maggi Noodles are running low (12 left, threshold 25). Reorder soon!', date: '2026-07-22T08:00:00Z', read: false },
  { id: 'n2', type: 'payment', title: 'Overdue Udhaar Payment', message: 'Amit Verma credit of ₹2,800 is overdue by 12 days.', date: '2026-07-21T09:30:00Z', read: false },
  { id: 'n3', type: 'ai', title: 'AI Optimization Tip', message: 'Mustard oil sales usually spike by 15% on weekends. Consider stocking up!', date: '2026-07-22T10:00:00Z', read: true }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync states from localStorage for PWA offline capabilities
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kirana_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('kirana_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kirana_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('kirana_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kirana_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>(() => {
    const saved = localStorage.getItem('kirana_lang');
    return (saved as any) || 'en';
  });

  const [shopProfile, setShopProfile] = useState<ShopProfile>(() => {
    const saved = localStorage.getItem('kirana_shop_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Apna Bazar Kirana',
      address: 'Shop No. 12, Chandni Chowk, Main Market, Delhi - 110006',
      phone: '9876543210',
      upiId: 'apnabazar@paytm'
    };
  });

  // Save states to localstorage whenever they change
  useEffect(() => {
    localStorage.setItem('kirana_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kirana_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('kirana_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kirana_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kirana_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('kirana_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('kirana_shop_profile', JSON.stringify(shopProfile));
  }, [shopProfile]);

  // Actions
  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const p: Product = {
      ...newProduct,
      id: 'p_' + Date.now()
    };
    setProducts(prev => [p, ...prev]);
    addNotification('stock', 'New Product Added', `${p.name} has been added to the inventory.`);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const result = { ...p, ...updatedFields };
        // Trigger alert if stock falls below minStock
        if (result.stock <= result.minStock && p.stock > p.minStock) {
          addNotification('stock', 'Low Stock Alert', `${result.name} is low on stock (${result.stock} left).`);
        }
        return result;
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCustomer = (newCustomer: Omit<Customer, 'id' | 'pendingAmount' | 'history' | 'riskStatus'>) => {
    const c: Customer = {
      ...newCustomer,
      id: 'c_' + Date.now(),
      pendingAmount: 0,
      riskStatus: 'low',
      history: []
    };
    setCustomers(prev => [c, ...prev]);
  };

  const addUdhaar = (customerId: string, amount: number, note: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const nextPending = c.pendingAmount + amount;
        const entry: LedgerEntry = {
          id: 'l_' + Date.now(),
          type: 'credit',
          amount,
          date: new Date().toISOString().split('T')[0],
          note
        };
        const risk: Customer['riskStatus'] = nextPending > 2000 ? 'high' : nextPending > 1000 ? 'medium' : 'low';
        return {
          ...c,
          pendingAmount: nextPending,
          riskStatus: risk,
          history: [entry, ...c.history]
        };
      }
      return c;
    }));
  };

  const payUdhaar = (customerId: string, amount: number, note: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const nextPending = Math.max(0, c.pendingAmount - amount);
        const entry: LedgerEntry = {
          id: 'l_' + Date.now(),
          type: 'payment',
          amount,
          date: new Date().toISOString().split('T')[0],
          note
        };
        const risk: Customer['riskStatus'] = nextPending > 2000 ? 'high' : nextPending > 1000 ? 'medium' : 'low';
        
        // Trigger visual success effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F97316', '#FB923C', '#FFEDD5', '#22C55E']
        });

        return {
          ...c,
          pendingAmount: nextPending,
          riskStatus: risk,
          history: [entry, ...c.history]
        };
      }
      return c;
    }));
  };

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, qty: Math.min(product.stock, item.qty + qty) }
            : item
        );
      }
      return [...prev, { product, qty: Math.min(product.stock, qty) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, qty: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, qty: Math.max(1, Math.min(item.product.stock, qty)) }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const completeCheckout = (paymentMethod: 'cash' | 'upi' | 'udhaar', customerId: string | null) => {
    if (cart.length === 0) return { success: false };

    // Validate stock
    for (const item of cart) {
      if (item.product.stock < item.qty) {
        alert(`Insufficient stock for ${item.product.name}`);
        return { success: false };
      }
    }

    // Deduct stock
    cart.forEach(item => {
      updateProduct(item.product.id, { stock: item.product.stock - item.qty });
    });

    const total = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);
    const cost = cart.reduce((acc, item) => acc + item.product.costPrice * item.qty, 0);
    const profit = total - cost;

    const matchedCustomer = customerId ? customers.find(c => c.id === customerId) : null;

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      date: new Date().toISOString(),
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        qty: item.qty,
        price: item.product.price,
        costPrice: item.product.costPrice
      })),
      total,
      profit,
      paymentMethod,
      customerId,
      customerName: matchedCustomer?.name
    };

    setTransactions(prev => [newTx, ...prev]);

    // Handle Udhaar adjustment
    if (paymentMethod === 'udhaar' && customerId) {
      addUdhaar(customerId, total, `POS Purchase (TX: ${newTx.id.slice(-6)})`);
    }

    // Clear cart
    setCart([]);

    // Celebrate!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F97316', '#FB923C', '#10B981']
    });

    return { success: true, transaction: newTx };
  };

  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const notif: Notification = {
      id: 'n_' + Date.now(),
      type,
      title,
      message,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateShopProfile = (profile: ShopProfile) => {
    setShopProfile(profile);
  };

  const triggerAiForecast = () => {
    addNotification(
      'ai',
      'AI Analysis Completed',
      'Stock replenishment recommendation: Restock Maggi Noodles & Atta. Expected demand increase of 30% due to upcoming local festival.'
    );
    alert('AI Demand Forecast generated successfully! Check your notifications drawer.');
  };

  // Voice command handler
  const processVoiceCommand = (command: string): { success: boolean; feedback: string } => {
    const cmd = command.toLowerCase().trim();
    
    // Command 1: "Sold X Product" or "X Product becha"
    // Regex: (sold|sell|becha|bech diya)\s+(\d+)\s+(.+)|(\d+)\s+(.+)\s+(sold|becha)
    const sellRegex = /(?:sold|sell|becha|bech\s+diya)\s+(\d+)\s+(.+)/i;
    const sellRegexHinglish = /(\d+)\s+(.+?)\s+(?:becha|sold|bech\s+diya)/i;
    
    let match = cmd.match(sellRegex) || cmd.match(sellRegexHinglish);
    if (match) {
      const qty = parseInt(match[1] || match[1]);
      const searchName = (match[2] || match[2]).trim();
      
      // Find product
      const foundProduct = products.find(p => p.name.toLowerCase().includes(searchName) || p.category.toLowerCase().includes(searchName));
      
      if (foundProduct) {
        if (foundProduct.stock < qty) {
          return { success: false, feedback: `Cannot sell ${qty} ${foundProduct.name}. Only ${foundProduct.stock} left in stock!` };
        }
        addToCart(foundProduct, qty);
        setActiveView('pos');
        return { success: true, feedback: `Added ${qty} ${foundProduct.name} to checkout cart.` };
      }
      return { success: false, feedback: `Could not find any product matching "${searchName}" in inventory.` };
    }

    // Command 2: "Add ₹X udhaar for Customer" or "Customer ko X udhaar do"
    // Regex: (add|give)?\s*(?:rs|rs\.|rupees|₹)?\s*(\d+)\s*(?:udhaar|credit)\s*(?:for|to)?\s*(.+)
    // Hinglish: (.+?)\s*(?:ko)?\s*(?:rs|rs\.|rupees|₹)?\s*(\d+)\s*(?:udhaar|credit)\s*(?:do|de\s+do|charhao)
    const udhaarRegex = /(?:add|give)?\s*(?:rs|rupees|₹)?\s*(\d+)\s*(?:udhaar|credit)\s*(?:for|to)?\s*(.+)/i;
    const udhaarRegexHinglish = /(.+?)\s*(?:ko)?\s*(?:rs|rupees|₹)?\s*(\d+)\s*(?:udhaar|credit)\s*(?:do|de\s+do|charhao)/i;

    let uMatch = cmd.match(udhaarRegex);
    let uCustName = '';
    let uAmount = 0;

    if (uMatch) {
      uAmount = parseInt(uMatch[1]);
      uCustName = uMatch[2].trim();
    } else {
      let uMatchH = cmd.match(udhaarRegexHinglish);
      if (uMatchH) {
        uCustName = uMatchH[1].trim();
        uAmount = parseInt(uMatchH[2]);
      }
    }

    if (uCustName && uAmount > 0) {
      // Find customer
      const foundCustomer = customers.find(c => c.name.toLowerCase().includes(uCustName.toLowerCase()));
      if (foundCustomer) {
        addUdhaar(foundCustomer.id, uAmount, 'Added via Voice Command');
        setActiveView('udhaar');
        return { success: true, feedback: `Added ₹${uAmount} udhaar to ${foundCustomer.name}'s account.` };
      } else {
        // Option to create one or suggest
        return { success: false, feedback: `Customer "${uCustName}" not found. Please create customer first.` };
      }
    }

    // Command 3: "Show today's sales" or "Sales dikhao"
    if (cmd.includes('sales') || cmd.includes('dashboard') || cmd.includes('aaj ki sale')) {
      setActiveView('dashboard');
      return { success: true, feedback: 'Opening Dashboard and today\'s sales analytics.' };
    }

    // Command 4: "Which products need restocking?" or "restocking" or "low stock" or "stock check"
    if (cmd.includes('restock') || cmd.includes('low stock') || cmd.includes('stock empty') || cmd.includes('kam stock')) {
      setActiveView('inventory');
      return { success: true, feedback: 'Opening Inventory showing low-stock alert products.' };
    }

    // Command 5: "Open ledger" / "ledger" / "udhaar ledger" / "khata"
    if (cmd.includes('ledger') || cmd.includes('udhaar') || cmd.includes('khata') || cmd.includes('credit')) {
      setActiveView('udhaar');
      return { success: true, feedback: 'Opening Udhaar Ledger Book.' };
    }

    return { 
      success: false, 
      feedback: `Sorry, I couldn't understand "${command}". Try: "Sold 2 Maggi", "Rahul Sharma ko ₹500 udhaar do", or "Show today's sales".` 
    };
  };

  return (
    <AppContext.Provider value={{
      products,
      customers,
      transactions,
      notifications,
      cart,
      shopProfile,
      activeView,
      setActiveView,
      theme,
      setTheme,
      language,
      setLanguage,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      addUdhaar,
      payUdhaar,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      completeCheckout,
      addNotification,
      markNotificationsAsRead,
      updateShopProfile,
      processVoiceCommand,
      triggerAiForecast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
