import React, { useState, useEffect } from 'react';
import { Utensils, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import mealService from '../services/mealService';

const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getTodayStr = () => new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, menuRes] = await Promise.all([
        mealService.getMyBookings(),
        mealService.getTodayMenu(getTodayStr()).catch(() => ({ success: false }))
      ]);

      if (bookingsRes.success) {
        setBookings(bookingsRes.data);
      }
      if (menuRes.success) {
        setMenu(menuRes.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusForMeal = (mealType) => {
    const today = getTodayStr();
    return bookings.find(b => b.meal_type === mealType && b.date === today);
  };

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', time: '07:30 - 09:00', icon: <Clock className="text-amber-500" size={18} /> },
    { id: 'lunch', name: 'Lunch', time: '12:30 - 14:00', icon: <Clock className="text-emerald-500" size={18} /> },
    { id: 'dinner', name: 'Dinner', time: '19:30 - 21:00', icon: <Clock className="text-blue-500" size={18} /> },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Today's Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">Viewing bookings and menu for {new Date().toLocaleDateString()}</p>
        </div>
        <button 
          onClick={fetchData}
          className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mealTypes.map((meal) => {
              const booking = getStatusForMeal(meal.id);
              const isBooked = booking?.status === 'booked';
              
              return (
                <div key={meal.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Utensils className="text-emerald-600 dark:text-emerald-500" size={20} />
                    </div>
                    {isBooked ? (
                      <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded-full">Booked ✔</span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-full">Not Booked</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{meal.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{meal.time}</p>
                </div>
              );
            })}
          </div>

          {/* Menu Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mess Menu</h3>
              <Calendar className="text-slate-400" size={20} />
            </div>
            <div className="p-6">
              {menu ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['breakfast', 'lunch', 'dinner'].map(type => (
                    <div key={type} className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{type}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {menu[type] || 'No menu items listed.'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400">
                    <Info size={32} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">No menu has been uploaded for today yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info/Activity */}
        <div className="space-y-6">
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
            <h3 className="font-bold text-lg mb-2">Need to book?</h3>
            <p className="text-emerald-50 text-sm mb-4 leading-relaxed">Head over to the Booking page to manage your meal plan for today or future dates.</p>
            <a href="/student/booking" className="inline-block bg-white text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors">Go to Booking</a>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{b.meal_type}</p>
                    <p className="text-[10px] text-slate-500">{new Date(b.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${b.status === 'booked' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {b.status === 'booked' ? 'CONFIRMED' : 'CANCELLED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
