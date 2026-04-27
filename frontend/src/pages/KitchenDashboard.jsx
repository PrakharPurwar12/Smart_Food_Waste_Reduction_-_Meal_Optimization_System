import React, { useState, useEffect } from 'react';
import { Users, Utensils, Calendar, ChevronRight, Download, RefreshCcw, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import mealService from '../services/mealService';
import Button from '../components/Button';

const KitchenDashboard = () => {
  const [stats, setStats] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [menu, setMenu] = useState({ breakfast: '', lunch: '', dinner: '' });
  const [loading, setLoading] = useState(true);
  const [menuSaving, setMenuSaving] = useState(false);
  const [message, setMessage] = useState('');

  const getTodayStr = () => new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const today = getTodayStr();
      const [statsRes, menuRes] = await Promise.all([
        mealService.getMealStats(today),
        mealService.getTodayMenu(today).catch(() => ({ success: false }))
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (menuRes.success) setMenu(menuRes.data);
    } catch (err) {
      console.error('Failed to fetch kitchen data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMenu = async () => {
    setMenuSaving(true);
    setMessage('');
    try {
      const response = await mealService.uploadMenu({
        ...menu,
        date: getTodayStr()
      });
      if (response.success) {
        setMessage('Menu updated successfully! ✔');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save menu', err);
      setMessage('Failed to save menu. ❌');
    } finally {
      setMenuSaving(false);
    }
  };

  const chartData = [
    { name: 'Breakfast', count: stats.breakfast, color: '#F59E0B' },
    { name: 'Lunch', count: stats.lunch, color: '#10B981' },
    { name: 'Dinner', count: stats.dinner, color: '#3B82F6' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Loading kitchen dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Kitchen Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">Real-time booking analytics and menu management.</p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all shadow-sm self-start md:self-auto"
        >
          <RefreshCcw size={18} />
          <span className="text-sm font-semibold">Refresh Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chartData.map((item) => (
              <div key={item.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{item.name}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{item.count}</h3>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                    <Utensils size={20} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">TOTAL BOOKINGS TODAY</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Booking Trends</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Menu Management Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">Daily Menu</h3>
              <Calendar size={18} className="text-slate-400" />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Breakfast</label>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[80px] text-slate-700 dark:text-slate-300"
                  placeholder="e.g. Poha, Tea, Fruit"
                  value={menu.breakfast}
                  onChange={(e) => setMenu({...menu, breakfast: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Lunch</label>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[80px] text-slate-700 dark:text-slate-300"
                  placeholder="e.g. Rice, Dal, Paneer"
                  value={menu.lunch}
                  onChange={(e) => setMenu({...menu, lunch: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Dinner</label>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[80px] text-slate-700 dark:text-slate-300"
                  placeholder="e.g. Roti, Mix Veg, Curd"
                  value={menu.dinner}
                  onChange={(e) => setMenu({...menu, dinner: e.target.value})}
                />
              </div>
            </div>

            <Button 
              className="w-full py-3" 
              onClick={handleSaveMenu}
              isLoading={menuSaving}
            >
              <Save size={18} className="mr-2" />
              Save Menu
            </Button>

            {message && (
              <p className={`text-center text-sm font-medium ${message.includes('success') ? 'text-emerald-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Export Data</h3>
              <p className="text-slate-400 text-xs mb-4">Download today's booking list in CSV format for offline records.</p>
              <button className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                <Download size={16} />
                <span>Download CSV</span>
              </button>
            </div>
            <Utensils className="absolute -right-4 -bottom-4 text-slate-800" size={120} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
