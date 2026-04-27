import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import mealService from '../services/mealService';

// ─── Meal start times (24h, IST) ────────────────────────────────────────────
const MEAL_START_TIMES = {
  breakfast: { h: 7,  m: 30 },
  lunch:     { h: 12, m: 30 },
  dinner:    { h: 19, m: 30 },
};

const MEAL_DISPLAY = [
  { id: 'breakfast', name: 'Breakfast', time: '07:30 – 09:00', color: 'text-amber-500' },
  { id: 'lunch',     name: 'Lunch',     time: '12:30 – 14:00', color: 'text-emerald-500' },
  { id: 'dinner',    name: 'Dinner',    time: '19:30 – 21:00', color: 'text-blue-500' },
];

/** Returns true when cancellation is still allowed (before meal start time). */
function canCancelNow(mealType) {
  const { h, m } = MEAL_START_TIMES[mealType] ?? { h: 0, m: 0 };
  const now  = new Date();
  const meal = new Date();
  meal.setHours(h, m, 0, 0);
  return now < meal;
}

/** e.g. "07:30" */
function startTimeLabel(mealType) {
  const { h, m } = MEAL_START_TIMES[mealType] ?? { h: 0, m: 0 };
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Returns today's date as YYYY-MM-DD in local time. */
function getTodayStr() {
  return new Date().toLocaleDateString('en-CA');
}

// ────────────────────────────────────────────────────────────────────────────

const MealBookingPage = () => {
  const [bookings,      setBookings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // ── Data fetch ─────────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    try {
      const res = await mealService.getMyBookings();
      if (res.success) setBookings(res.data);
      else setError(res.error || 'Failed to load bookings.');
    } catch (err) {
      setError('Failed to load your bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getBookingForMeal = (mealId) => {
    const today = getTodayStr();
    return bookings.find(b => b.meal_type === mealId && b.date === today) ?? null;
  };

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleBook = async (mealType) => {
    setActionLoading(mealType);
    setError('');
    try {
      const res = await mealService.bookMeal({ meal_type: mealType, date: getTodayStr() });
      if (res.success) {
        await fetchBookings();
      } else {
        setError(res.error || 'Failed to book meal.');
      }
    } catch (err) {
      setError(err.message || 'Failed to book meal.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (bookingId) => {
    setActionLoading(bookingId);
    setError('');
    try {
      const res = await mealService.cancelBooking(bookingId);
      if (res.success) {
        await fetchBookings();
      } else {
        setError(res.error || 'Failed to cancel booking.');
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Book Your Meals</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage today's bookings — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={fetchBookings}
          title="Refresh"
          className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* Cancellation rule notice */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl text-blue-700 dark:text-blue-400 text-sm">
        <Info size={18} className="mt-0.5 shrink-0" />
        <span>Cancellation is allowed <strong>until the meal's start time</strong>. After that the booking is locked.</span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle size={20} />
            <span className="font-medium text-sm">{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <XCircle size={18} />
          </button>
        </div>
      )}

      {/* Meal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEAL_DISPLAY.map((meal) => {
          const booking   = getBookingForMeal(meal.id);
          const isBooked  = booking?.status === 'booked';
          const isCancelled = booking?.status === 'cancelled';

          // Time-based cancel permission
          const cancelAllowed = isBooked && canCancelNow(meal.id);
          const isActionLoading = actionLoading === meal.id || actionLoading === booking?.id;

          return (
            <motion.div
              key={meal.id}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col space-y-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Utensils className="text-emerald-600 dark:text-emerald-500" size={22} />
                </div>

                {isBooked && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                    <CheckCircle2 size={11} /> Booked ✔
                  </span>
                )}
                {isCancelled && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800">
                    <XCircle size={11} /> Cancelled
                  </span>
                )}
                {!booking && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                    Not Booked
                  </span>
                )}
              </div>

              {/* Title & time */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{meal.name}</h3>
                <div className={`flex items-center gap-1.5 mt-1 ${meal.color}`}>
                  <Clock size={14} />
                  <span className="text-sm font-medium">{meal.time}</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-auto pt-2 space-y-2">
                {isBooked ? (
                  <>
                    <Button
                      variant="outline"
                      disabled={isActionLoading}
                      isLoading={isActionLoading}
                      onClick={() => {
                        if (!cancelAllowed) {
                          setError(`Cannot cancel ${meal.name} — meal started at ${startTimeLabel(meal.id)}.`);
                        } else {
                          handleCancel(booking.id);
                        }
                      }}
                      className={`w-full py-2 transition-all ${
                        cancelAllowed
                          ? '!border-red-200 dark:!border-red-900/30 !text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/10'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      {isActionLoading ? 'Cancelling…' : 'Cancel Booking'}
                    </Button>
                    {!cancelAllowed && (
                      <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 italic">
                        Cannot cancel after meal has started
                      </p>
                    )}
                    {cancelAllowed && (
                      <p className="text-[10px] text-center text-emerald-500 dark:text-emerald-400 italic">
                        Cancellation allowed until {startTimeLabel(meal.id)}
                      </p>
                    )}
                  </>
                ) : (
                  <Button
                    className={`w-full py-2 ${isCancelled ? '!bg-indigo-600 hover:!bg-indigo-700 !shadow-indigo-500/20' : ''}`}
                    onClick={() => handleBook(meal.id)}
                    disabled={isActionLoading}
                    isLoading={isActionLoading}
                  >
                    {isCancelled ? 'Re-book Meal' : 'Book Now'}
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MealBookingPage;
