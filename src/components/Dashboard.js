import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Loader2, 
  Calendar 
} from 'lucide-react';

export default function Dashboard({ 
  transactions = [], 
  loading = false, 
  onOpenModal, 
  currentUser 
}) {
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month, year, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Loading dashboard environment...</p>
      </div>
    );
  }

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Filter transactions based on date range selection
  const filteredTransactions = safeTransactions.filter(t => {
    if (!t.date) return true;
    const txDate = new Date(t.date);
    const today = new Date();

    if (dateRange === 'today') {
      return txDate.toDateString() === today.toDateString();
    } else if (dateRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return txDate >= oneWeekAgo && txDate <= today;
    } else if (dateRange === 'month') {
      return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
    } else if (dateRange === 'year') {
      return txDate.getFullYear() === today.getFullYear();
    } else if (dateRange === 'custom') {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) return txDate >= start && txDate <= end;
      if (start) return txDate >= start;
      if (end) return txDate <= end;
    }
    return true;
  });

  // Dynamic calculations based on filtered transactions
  const incomeTotal = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const expenseTotal = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const balance = incomeTotal - expenseTotal;

  // Category badge colors
  const getCategoryBadgeClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food')) return 'bg-pink-900/60 text-pink-400 border border-pink-700/50';
    if (cat.includes('trans')) return 'bg-amber-900/60 text-amber-400 border border-amber-700/50';
    if (cat.includes('house')) return 'bg-blue-900/60 text-blue-400 border border-blue-700/50';
    if (cat.includes('util')) return 'bg-cyan-900/60 text-cyan-400 border border-cyan-700/50';
    if (cat.includes('enter')) return 'bg-purple-900/60 text-purple-400 border border-purple-700/50';
    if (cat.includes('salar') || cat.includes('free')) return 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50';
    return 'bg-slate-800 text-slate-300 border border-slate-700';
  };

  // Chart 1: Dynamic Category Totals
  const categories = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment'];
  const categoryTotals = categories.map(cat => {
    return filteredTransactions
      .filter(t => t.type === 'expense' && (t.category || '').toLowerCase() === cat.toLowerCase())
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  });
  const maxCategoryAmount = Math.max(...categoryTotals, 1);

  // Chart 2: Dynamic Cash Flow Ratio
  const totalVolume = (incomeTotal + expenseTotal) || 1;
  const expensePercentage = Math.round((expenseTotal / totalVolume) * 100);
  const incomePercentage = Math.round((incomeTotal / totalVolume) * 100);

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* SECTION 1: Timeframe Selector */}
      <div className="bg-[#18181b] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Dashboard By Date:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#101012] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Past 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range / Year Gap</option>
          </select>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 bg-[#101012] p-1.5 rounded-xl border border-slate-800">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none px-1"
              />
              <span className="text-xs text-slate-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none px-1"
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Dynamic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#18181b] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Filtered Balance</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
            ${balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#18181b] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Filtered Income</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">${incomeTotal.toLocaleString()}</p>
        </div>

        <div className="bg-[#18181b] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-medium">Filtered Expense</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-400">${expenseTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* SECTION 3: Filtered Recent Expenses Table */}
      <div className="bg-[#18181b] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300 tracking-wide">Recent Expenses</h3>
          <button 
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#232328] hover:bg-[#2d2d34] border border-slate-800 rounded-lg text-xs font-medium text-slate-300 transition"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            New Expense
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800/80">
                <th className="pb-2 font-medium">Subject</th>
                <th className="pb-2 font-medium">User</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No transactions found for the selected timeframe.
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 5).map((tx) => (
                  <tr key={tx._id || tx.id || Math.random()} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 font-medium text-slate-200">{tx.title || 'Untitled'}</td>
                    <td className="py-2.5 text-slate-400">{currentUser?.name || 'User'}</td>
                    <td className="py-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${getCategoryBadgeClass(tx.category)}`}>
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">{tx.date}</td>
                    <td className="py-2.5 text-right font-bold text-slate-100">
                      ${Number(tx.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: Dynamic Reports & Charts */}
      <div className="bg-[#18181b] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 tracking-wide">Monthly / Period Analytics</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Category Breakdown for Selected Range */}
          <div className="bg-[#121214] border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs text-slate-400 mb-6 font-medium">Category Spending Breakdown</h4>
            <div className="h-40 flex items-end justify-between gap-3 px-2">
              {categories.map((cat, index) => {
                const heightPercent = Math.max(Math.round((categoryTotals[index] / maxCategoryAmount) * 100), 5);
                return (
                  <div key={cat} className="w-full flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition mb-1">
                      ${categoryTotals[index]}
                    </span>
                    <div 
                      style={{ height: `${heightPercent}%` }} 
                      className="w-full bg-cyan-500/80 hover:bg-cyan-400 rounded-t transition-all duration-500"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
              {categories.map(cat => <span key={cat}>{cat.slice(0, 5)}</span>)}
            </div>
          </div>

          {/* Chart 2: Cashflow Ratio for Selected Range */}
          <div className="bg-[#121214] border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs text-slate-400 mb-6 font-medium">Income vs Expense Ratio</h4>
            <div className="h-40 flex items-end justify-center gap-12 px-2">
              <div className="w-16 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] text-emerald-400 mb-1">${incomeTotal}</span>
                <div 
                  style={{ height: `${incomePercentage}%` }} 
                  className="w-full bg-emerald-500 rounded-t transition-all duration-500"
                />
              </div>

              <div className="w-16 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] text-rose-400 mb-1">${expenseTotal}</span>
                <div 
                  style={{ height: `${expensePercentage}%` }} 
                  className="w-full bg-purple-600 rounded-t transition-all duration-500"
                />
              </div>
            </div>
            <div className="flex justify-center gap-12 text-[10px] text-slate-400 mt-2">
              <span>Income ({incomePercentage}%)</span>
              <span>Expenses ({expensePercentage}%)</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}