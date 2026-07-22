import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Save, QrCode, Globe, Moon, Sun, Check, Wifi } from 'lucide-react';

const Settings: React.FC = () => {
  const { 
    shopProfile, 
    updateShopProfile, 
    theme, 
    setTheme, 
    language, 
    setLanguage 
  } = useApp();

  const [shopName, setShopName] = useState(shopProfile.name);
  const [shopAddress, setShopAddress] = useState(shopProfile.address);
  const [shopPhone, setShopPhone] = useState(shopProfile.phone);
  const [shopUpi, setShopUpi] = useState(shopProfile.upiId);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopProfile({
      name: shopName,
      address: shopAddress,
      phone: shopPhone,
      upiId: shopUpi
    });
    
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Save Success Toast */}
      {showSavedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 font-semibold text-sm">
          <Check size={16} />
          Shop settings updated successfully!
        </div>
      )}

      {/* Grid containing forms and quick indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Details Edit Form (2 cols) */}
        <div className={`p-6 rounded-3xl border md:col-span-2 transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon size={18} className="text-primary" />
            <h3 className="font-display font-bold text-base md:text-lg">Shop Profile Settings</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Shop Name</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                }`}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Shop Phone Number</label>
              <input
                type="tel"
                required
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">UPI Address (VPA)</label>
              <input
                type="text"
                required
                value={shopUpi}
                onChange={(e) => setShopUpi(e.target.value)}
                placeholder="shopname@paytm"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Shop Address</label>
              <textarea
                rows={3}
                required
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === 'dark' ? 'bg-slate-900 border-border-dark' : 'bg-white border-slate-200'
                }`}
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-primary hover:bg-primary-soft text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/10 hover:scale-[1.01] transition-all"
            >
              <Save size={14} />
              Save Shop Details
            </button>
          </form>
        </div>

        {/* UPI QR Display & Toggles (1 col) */}
        <div className="space-y-6">
          
          {/* QR Display */}
          <div className={`p-6 rounded-3xl border text-center space-y-4 transition-colors ${
            theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2 font-display font-bold">
              <QrCode size={18} className="text-primary" />
              <h4>Merchant UPI QR</h4>
            </div>

            <div className="p-3 bg-white border border-slate-100 rounded-2xl inline-block shadow-xs">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=${shopUpi}%26pn=${encodeURIComponent(shopName)}%26cu=INR`} 
                alt="UPI Merchant QR Code" 
                className="w-36 h-36 mx-auto"
              />
            </div>

            <p className="text-[10px] text-slate-400 font-semibold font-mono leading-none">
              UPI: {shopUpi}
            </p>
          </div>

          {/* Preferences Settings Panel */}
          <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
            theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-2 font-display font-bold">
              <Globe size={18} className="text-primary" />
              <h4>Global Settings</h4>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">System Language</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'en' ? 'bg-primary text-white' : 'text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'hi' ? 'bg-primary text-white' : 'text-slate-400'
                  }`}
                >
                  Hindi
                </button>
                <button
                  onClick={() => setLanguage('hinglish')}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'hinglish' ? 'bg-primary text-white' : 'text-slate-400'
                  }`}
                >
                  Hinglish
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Visual Theme</label>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold">Toggle Interface Mode</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`p-2 rounded-xl border flex items-center justify-center gap-2 transition-colors ${
                    theme === 'dark' 
                      ? 'border-border-dark bg-slate-900 text-amber-400' 
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>
            </div>

            {/* Offline Status PWA Indicator */}
            <div className="pt-3 border-t border-slate-100 dark:border-border-dark/60 flex items-center justify-between text-xs font-semibold text-emerald-500">
              <span className="flex items-center gap-1">
                <Wifi size={14} />
                PWA / Offline Status
              </span>
              <span className="bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold">Enabled</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;
