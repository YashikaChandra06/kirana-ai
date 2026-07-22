import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Printer, Check } from 'lucide-react';

const Reports: React.FC = () => {
  const { transactions, theme } = useApp();
  const [reportRange, setReportRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Stats Calculations
  const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
  const totalProfit = transactions.reduce((acc, t) => acc + t.profit, 0);
  const avgBasketValue = transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0;
  const transactionCount = transactions.length;

  const handleCsvExport = () => {
    // Generate CSV contents
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Transaction ID,Date,Payment Method,Customer Name,Total Amount (INR),Profit Generated (INR)\n';

    transactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString('en-IN');
      const name = t.customerName || 'Walk-in Customer';
      csvContent += `${t.id},${date},${t.paymentMethod},${name},${t.total},${t.profit}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KiranaAI_${reportRange}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportSuccess(true);
    setTimeout(() => {
      setShowExportSuccess(false);
    }, 3000);
  };

  const handlePdfPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Overviews */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Gross Sales Revenue</span>
          <span className="text-2xl font-bold font-display text-primary">₹{totalRevenue.toLocaleString('en-IN')}</span>
        </div>
        <div className={`p-5 rounded-2xl border transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Net Operating Profit</span>
          <span className="text-2xl font-bold font-display text-emerald-500">₹{totalProfit.toLocaleString('en-IN')}</span>
        </div>
        <div className={`p-5 rounded-2xl border transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Average Ticket Size</span>
          <span className="text-2xl font-bold font-display">₹{avgBasketValue.toLocaleString('en-IN')}</span>
        </div>
        <div className={`p-5 rounded-2xl border transition-colors ${
          theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
        }`}>
          <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Customer Checkouts</span>
          <span className="text-2xl font-bold font-display">{transactionCount} tickets</span>
        </div>
      </div>

      {/* Control Actions & Range Selection */}
      <div className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
      }`}>
        <div className="flex gap-1.5 p-0.5 border rounded-xl dark:border-border-dark bg-slate-50 dark:bg-slate-900 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setReportRange('daily')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              reportRange === 'daily' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Daily Sales
          </button>
          <button
            onClick={() => setReportRange('weekly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              reportRange === 'weekly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Weekly Summary
          </button>
          <button
            onClick={() => setReportRange('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              reportRange === 'monthly' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Monthly Revenue
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handlePdfPrint}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all ${
              theme === 'dark' ? 'border-border-dark bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <Printer size={14} />
            Print PDF
          </button>
          <button
            onClick={handleCsvExport}
            className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-soft flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-orange-500/10"
          >
            {showExportSuccess ? (
              <>
                <Check size={14} />
                Exported Excel!
              </>
            ) : (
              <>
                <Download size={14} />
                Export Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reports Logs Listing */}
      <div className={`p-6 rounded-3xl border transition-all ${
        theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-6">
          <FileText size={18} className="text-primary" />
          <h3 className="font-display font-bold text-base md:text-lg">Detailed Sales Register</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-slate-400 border-b border-inherit text-xs font-semibold uppercase tracking-wider pb-3">
                <th className="py-3">Invoice ID</th>
                <th>Checkout Date</th>
                <th>Linked Customer</th>
                <th>Type</th>
                <th className="text-right">Profit Margin</th>
                <th className="text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions captured in selected range.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="text-sm font-medium hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                    <td className="py-4 font-mono text-xs">{t.id.toUpperCase()}</td>
                    <td className="text-xs text-slate-500">
                      {new Date(t.date).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>{t.customerName || <span className="text-slate-400 font-semibold italic text-xs">Walk-in customer</span>}</td>
                    <td>
                      <span className="uppercase text-xs font-bold text-slate-500">{t.paymentMethod}</span>
                    </td>
                    <td className="text-right text-emerald-500 font-semibold font-mono">₹{t.profit}</td>
                    <td className="text-right font-extrabold font-mono text-base">₹{t.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Reports;
