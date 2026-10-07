import React, { useState } from 'react';
import { Search, Filter, Trash2, Calendar } from 'lucide-react';

export default function Transactions({ transactions = [], onDelete }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month, year, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Date Filtering Logic
  const filtered = safeTransactions.filter(t => {
    // 1. Category Filter
    const matchesCategory = filterCategory === 'all' || (t.category || '').toLowerCase() === filterCategory.toLowerCase();
    
    // 2. Search Filter
    const matchesSearch = (t.title || '').toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Date Range Filter
    let matchesDate = true;
    if (t.date) {
      const txDate = new Date(t.date);
      const today = new Date();

      if (dateRange === 'today') {
        matchesDate = txDate.toDateString() === today.toDateString();
      } else if (dateRange === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        matchesDate = txDate >= oneWeekAgo && txDate <= today;
      } else if (dateRange === 'month') {
        matchesDate = txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
      } else if (dateRange === 'year') {
        matchesDate = txDate.getFullYear() === today.getFullYear();
      } else if (dateRange === 'custom') {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          matchesDate = txDate >= start && txDate <= end;
        } else if (start) {
          matchesDate = txDate >= start;
        } else if (end) {
          matchesDate = txDate <= end;
        }
      }
    }

    return matchesCategory && matchesSearch && matchesDate;
  });

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

  return (
    <div className="bg-[#18181b] border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Controls Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#101012] border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
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
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-[#101012] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

        </div>

        {/* Custom Start & End Date Inputs (Shown only when 'Custom Range / Year Gap' is selected) */}
        {dateRange === 'custom' && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800/80 bg-[#121214] p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#101012] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#101012] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="text-xs text-slate-400 hover:text-emerald-400 underline ml-auto"
            >
              Reset Dates
            </button>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-500 uppercase tracking-wider font-medium">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  No matching transactions found for the selected timeframe.
                </td>
              </tr>
            ) : (
              filtered.map(tx => (
                <tr key={tx._id || tx.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-medium text-slate-200">{tx.title}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${getCategoryBadgeClass(tx.category)}`}>
                      {tx.category || 'General'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                  <td className={`py-3 px-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}${Number(tx.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onDelete(tx._id || tx.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}