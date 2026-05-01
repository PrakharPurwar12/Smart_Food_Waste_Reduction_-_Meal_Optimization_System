import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Info, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import mealService from '../services/mealService';
import { useAuth } from '../hooks/AuthContext';

const MEAL_START_TIMES = {
  breakfast: { h: 7, m: 30 },
  lunch: { h: 12, m: 30 },
  dinner: { h: 19, m: 30 },
};

const getTodayStr = () => new Date().toLocaleDateString('en-CA');

const calculateMealStatus = (mealType, selectedDateStr) => {
  const todayStr = getTodayStr();
  
  if (selectedDateStr < todayStr) return 'Closed';
  if (selectedDateStr > todayStr) return 'Upcoming';
  
  // It's today
  const { h, m } = MEAL_START_TIMES[mealType];
  const now = new Date();
  
  const mealStart = new Date();
  mealStart.setHours(h, m, 0, 0);
  
  // Ongoing means within 1.5 hours of start
  const mealEnd = new Date(mealStart.getTime() + 90 * 60000); 
  
  if (now > mealEnd) return 'Closed';
  if (now >= mealStart && now <= mealEnd) return 'Ongoing';
  return 'Upcoming';
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [bookings, setBookings] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Removed redundant college check since ProtectedRoute handles it now

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, menuRes] = await Promise.all([
        mealService.getMyBookings(selectedDate),
        mealService.getTodayMenu(selectedDate).catch(() => ({ success: false }))
      ]);

      if (bookingsRes.success) {
        setBookings(bookingsRes.data);
      } else {
        // Handle no college error or other
        if (bookingsRes.error?.includes('college')) {
            setError('You must be assigned to a college to view the dashboard.');
        }
      }
      
      if (menuRes.success) {
        setMenu(menuRes.data);
      } else {
        setMenu(null);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toLocaleDateString('en-CA'));
  };

  const getStatusForMeal = (mealType) => {
    return bookings.find(b => b.meal_type === mealType && b.status === 'booked');
  };

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', time: '07:30 - 09:00', icon: <Clock className="text-amber-500" size={18} /> },
    { id: 'lunch', name: 'Lunch', time: '12:30 - 14:00', icon: <Clock className="text-emerald-500" size={18} /> },
    { id: 'dinner', name: 'Dinner', time: '19:30 - 21:00', icon: <Clock className="text-blue-500" size={18} /> },
  ];

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-red-50 text-red-600 rounded-2xl border border-red-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <XCircle size={48} className="text-red-400" />
          <h2 className="text-xl font-bold">Error</h2>
          <p className="font-medium text-center">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-red-100 rounded-xl hover:bg-red-200 font-bold transition">Try Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Calendar Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Smart Meal Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400">View your bookings and the mess menu for any date.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button onClick={() => changeDate(-1)} className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <ChevronLeft size={20} />
            </button>
            <div className="relative">
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="appearance-none bg-transparent font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full px-2"
                />
                <CalendarIcon size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none opacity-0 md:opacity-100 hidden" />
            </div>
            <button onClick={() => changeDate(1)} className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <ChevronRight size={20} />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={fetchData} title="Refresh Data" className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400 space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
            <span>Loading dashboard...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Section */}
            <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mealTypes.map((meal) => {
                const booking = getStatusForMeal(meal.id);
                const isBooked = !!booking;
                const mealStatus = calculateMealStatus(meal.id, selectedDate);
                
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={meal.id} 
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
                    >
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Utensils className="text-emerald-600 dark:text-emerald-500" size={20} />
                        </div>
                        {isBooked ? (
                        <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={12} /> Booked
                        </span>
                        ) : (
                        <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-full">
                            Not Booked
                        </span>
                        )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{meal.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{meal.time}</p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            mealStatus === 'Ongoing' ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' :
                            mealStatus === 'Closed' ? 'text-slate-400 bg-slate-50 dark:text-slate-500 dark:bg-slate-800' :
                            'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20'
                        }`}>
                            • {mealStatus}
                        </span>
                    </div>
                    </motion.div>
                );
                })}
            </div>

            {/* Menu Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon className="text-emerald-500" size={20} />
                    Mess Menu for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
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
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-full text-orange-400">
                        <Info size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-200">No Menu Available</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">The kitchen has not uploaded the menu for this date yet.</p>
                    </div>
                    </div>
                )}
                </div>
            </div>
            </div>

            {/* Sidebar Info/Activity */}
            <div className="space-y-6">
            <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
                <h3 className="font-bold text-lg mb-2">Manage Bookings</h3>
                <p className="text-emerald-50 text-sm mb-4 leading-relaxed">Need to make changes? Head over to the Booking page to manage your meal plan.</p>
                <button onClick={() => navigate('/student/booking')} className="inline-block bg-white text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm w-full text-center">
                    Go to Booking Page
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Quick Summary</h3>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Meals Booked</span>
                        <span className="font-bold text-slate-900 dark:text-white text-lg">{bookings.filter(b => b.status === 'booked').length} / 3</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Date Viewed</span>
                        <span className="font-medium text-slate-900 dark:text-white text-sm">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
