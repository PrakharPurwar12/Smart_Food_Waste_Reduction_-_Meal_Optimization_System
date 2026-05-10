import { useState, useEffect, useCallback } from 'react';
import {
  Utensils, Clock, CheckCircle2, XCircle, AlertCircle,
  RefreshCcw, Info, ChevronLeft, ChevronRight, Ban,
  CalendarIcon, History
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import mealService from '../services/mealService';

const MEAL_START_TIMES = {
  breakfast: { h: 7, m: 30 },
  lunch: { h: 12, m: 30 },
  dinner: { h: 19, m: 30 },
};

const MEAL_DISPLAY = [
  { id: 'breakfast', name: 'Breakfast', time: '07:30 – 09:00', color: 'text-amber-500' },
  { id: 'lunch',     name: 'Lunch',     time: '12:30 – 14:00', color: 'text-emerald-500' },
  { id: 'dinner',    name: 'Dinner',    time: '19:30 – 21:00', color: 'text-blue-500' },
];

const HISTORY_DAYS = 14;

function getTodayStr() {
  return new Date().toLocaleDateString('en-CA');
}

function shiftDate(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA');
}

function canCancelNow(mealType, selectedDateStr) {
  const todayStr = getTodayStr();
  if (selectedDateStr < todayStr) return false;
  if (selectedDateStr > todayStr) return true;
  const { h, m } = MEAL_START_TIMES[mealType] ?? { h: 0, m: 0 };
  const now = new Date();
  const meal = new Date();
  meal.setHours(h, m, 0, 0);
  return now < meal;
}

function startTimeLabel(mealType) {
  const { h, m } = MEAL_START_TIMES[mealType] ?? { h: 0, m: 0 };
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function toDateLabel(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

const STATUS_STYLES = {
  booked: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
  cancelled: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
};

const MEAL_COLORS = {
  breakfast: 'text-amber-500',
  lunch: 'text-emerald-500',
  dinner: 'text-blue-500',
};

const MealBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // History state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await mealService.getMyBookings(selectedDate);
      if (res.success) {
        setBookings(res.data);
      } else {
        setError(res.error || 'Failed to load bookings.');
      }
    } catch (err) {
      setError('Failed to load your bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Fetch last 14 days of booking history
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const today = getTodayStr();
      const dates = Array.from({ length: HISTORY_DAYS }, (_, i) =>
        shiftDate(today, -i)
      );

      const results = await Promise.all(
        dates.map((date) =>
          mealService
            .getMyBookings(date)
            .then((res) => ({
              date,
              bookings: res?.success ? res.data : [],
            }))
            .catch(() => ({ date, bookings: [] }))
        )
      );

      // Only include days that have at least one booking
      setHistory(results.filter((r) => r.bookings.length > 0));
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toLocaleDateString('en-CA'));
  };

  const getBookingForMeal = (mealId) =>
    bookings.find((b) => b.meal_type === mealId) ?? null;

  const handleBook = async (mealType) => {
    setActionLoading(mealType);
    setError('');
    try {
      const res = await mealService.bookMeal({
        meal_type: mealType,
        date: selectedDate,
      });
      if (res.success) {
        await fetchBookings();
        await fetchHistory();
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
        await fetchHistory();
      } else {
        setError(res.error || 'Failed to cancel booking.');
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(null);
    }
  };

  const isPastDate = selectedDate < getTodayStr();

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header & Date Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Book Your Meals
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage bookings for the selected date.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="appearance-none bg-transparent font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer px-2"
          />
          <button
            onClick={() => changeDate(1)}
            className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button
            onClick={fetchBookings}
            className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Rules Notice */}
      {isPastDate ? (
        <div className="flex items-start space-x-3 p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 text-sm">
          <Ban size={18} className="mt-0.5 shrink-0 text-slate-400" />
          <span>This is a past date. Bookings cannot be modified. View only mode.</span>
        </div>
      ) : selectedDate === getTodayStr() ? (
        <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl text-blue-700 dark:text-blue-400 text-sm">
          <Info size={18} className="mt-0.5 shrink-0" />
          <span>
            Cancellation for today is allowed{' '}
            <strong>until the meal's start time</strong>. After that the booking is locked.
          </span>
        </div>
      ) : (
        <div className="flex items-start space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm">
          <Info size={18} className="mt-0.5 shrink-0" />
          <span>This is a future date. You can book and cancel meals freely.</span>
        </div>
      )}

      {/* Error Banner */}
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
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEAL_DISPLAY.map((meal) => {
            const booking = getBookingForMeal(meal.id);
            const isBooked = booking?.status === 'booked';
            const isCancelled = booking?.status === 'cancelled';
            const cancelAllowed = isBooked && canCancelNow(meal.id, selectedDate);
            const isActionLoading =
              actionLoading === meal.id || actionLoading === booking?.id;

            return (
              <motion.div
                key={meal.id}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`bg-white dark:bg-slate-900 border ${
                  isPastDate
                    ? 'border-slate-100 dark:border-slate-800 opacity-80'
                    : 'border-slate-200 dark:border-slate-800'
                } rounded-2xl p-6 flex flex-col space-y-5 shadow-sm hover:shadow-md transition-all`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-xl ${
                      isPastDate
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-500'
                    }`}
                  >
                    <Utensils size={22} />
                  </div>
                  {isBooked && (
                    <span
                      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        isPastDate
                          ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                      }`}
                    >
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

                {/* Title & Time */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {meal.name}
                  </h3>
                  <div
                    className={`flex items-center gap-1.5 mt-1 ${
                      isPastDate ? 'text-slate-400' : meal.color
                    }`}
                  >
                    <Clock size={14} />
                    <span className="text-sm font-medium">{meal.time}</span>
                  </div>
                </div>

                {/* Action Area */}
                <div className="mt-auto pt-2 space-y-2">
                  {isPastDate ? (
                    <div className="w-full py-2 text-center text-sm font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      {isBooked ? 'Meal Closed' : 'Did Not Book'}
                    </div>
                  ) : isBooked ? (
                    <>
                      <Button
                        variant="outline"
                        disabled={isActionLoading || !cancelAllowed}
                        isLoading={isActionLoading}
                        onClick={() => {
                          if (!cancelAllowed) {
                            setError(
                              `Cannot cancel ${meal.name} — meal started at ${startTimeLabel(meal.id)}.`
                            );
                          } else {
                            handleCancel(booking.id);
                          }
                        }}
                        className={`w-full py-2 transition-all ${
                          cancelAllowed
                            ? '!border-red-200 dark:!border-red-900/30 !text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/10'
                            : 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800 border-none'
                        }`}
                      >
                        {isActionLoading
                          ? 'Cancelling…'
                          : cancelAllowed
                          ? 'Cancel Booking'
                          : 'Cancellation Locked'}
                      </Button>
                      {!cancelAllowed && selectedDate === getTodayStr() && (
                        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 italic">
                          Cannot cancel after meal has started
                        </p>
                      )}
                      {cancelAllowed && selectedDate === getTodayStr() && (
                        <p className="text-[10px] text-center text-emerald-500 dark:text-emerald-400 italic">
                          Cancellation allowed until {startTimeLabel(meal.id)}
                        </p>
                      )}
                    </>
                  ) : (
                    <Button
                      className={`w-full py-2 ${
                        isCancelled
                          ? '!bg-indigo-600 hover:!bg-indigo-700 !shadow-indigo-500/20'
                          : ''
                      }`}
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
      )}

      {/* ✅ Booking History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Booking History
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Last {HISTORY_DAYS} days
            </p>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full">
              <CalendarIcon size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              No booking history yet
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Your meal bookings from the last {HISTORY_DAYS} days will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map(({ date, bookings: dayBookings }) => (
              <div
                key={date}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {/* Date */}
                <div className="w-28 shrink-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {toDateLabel(date)}
                  </p>
                  {date === getTodayStr() && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Today
                    </span>
                  )}
                </div>

                {/* Meal Pills */}
                <div className="flex flex-wrap gap-2 flex-1">
                  {dayBookings.map((b) => (
                    <span
                      key={b.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                        STATUS_STYLES[b.status] ||
                        'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span className={MEAL_COLORS[b.meal_type]}>●</span>
                      {b.meal_type}
                      {b.status === 'booked' ? (
                        <CheckCircle2 size={11} />
                      ) : (
                        <XCircle size={11} />
                      )}
                    </span>
                  ))}
                </div>

                {/* Booked count */}
                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {dayBookings.filter((b) => b.status === 'booked').length}
                    <span className="text-slate-400 font-normal">/3</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default MealBookingPage;