import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  History,
  Info,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Utensils,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import mealService from '../services/mealService';

const MEAL_CONFIG = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    time: '07:30 - 09:00',
    start: { h: 7, m: 30 },
    end: { h: 9, m: 0 },
    accent: 'amber',
  },
  {
    id: 'lunch',
    name: 'Lunch',
    time: '12:30 - 14:00',
    start: { h: 12, m: 30 },
    end: { h: 14, m: 0 },
    accent: 'emerald',
  },
  {
    id: 'snacks',
    name: 'Snacks',
    time: '16:30 - 17:30',
    start: { h: 16, m: 30 },
    end: { h: 17, m: 30 },
    accent: 'slate',
    displayOnly: true,
  },
  {
    id: 'dinner',
    name: 'Dinner',
    time: '19:30 - 21:00',
    start: { h: 19, m: 30 },
    end: { h: 21, m: 0 },
    accent: 'blue',
  },
];

const ACCENT_CLASSES = {
  amber: {
    icon: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    badge: 'text-amber-700 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-900/30',
    button: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/30',
  },
  emerald: {
    icon: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20',
    badge: 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-900/30',
    button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/30',
  },
  slate: {
    icon: 'text-slate-500 bg-slate-100 dark:text-slate-300 dark:bg-slate-800',
    badge: 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700',
    button: 'bg-slate-600 hover:bg-slate-700 focus:ring-slate-500/30',
  },
  blue: {
    icon: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
    badge: 'text-blue-700 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-900/30',
    button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/30',
  },
};

const getTodayStr = () => new Date().toLocaleDateString('en-CA');

const toDateLabel = (dateStr) =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const shiftDate = (dateStr, days) => {
  const next = new Date(`${dateStr}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toLocaleDateString('en-CA');
};

const getMealStatus = (meal, selectedDate) => {
  const today = getTodayStr();
  if (selectedDate < today) return 'Closed';
  if (selectedDate > today) return 'Upcoming';

  const now = new Date();
  const start = new Date();
  start.setHours(meal.start.h, meal.start.m, 0, 0);
  const end = new Date();
  end.setHours(meal.end.h, meal.end.m, 0, 0);

  if (now < start) return 'Upcoming';
  if (now <= end) return 'Ongoing';
  return 'Closed';
};

const hasMealStarted = (meal, selectedDate) => {
  if (selectedDate < getTodayStr()) return true;
  if (selectedDate > getTodayStr()) return false;

  const now = new Date();
  const start = new Date();
  start.setHours(meal.start.h, meal.start.m, 0, 0);
  return now >= start;
};

const getToastStyles = (type) => {
  if (type === 'success') {
    return 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-900/40 dark:text-emerald-300';
  }
  return 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-300';
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [bookings, setBookings] = useState([]);
  const [manualMenu, setManualMenu] = useState(null);
  const [rotatingMenu, setRotatingMenu] = useState(null);
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [cardToasts, setCardToasts] = useState({});

  const isPastDate = selectedDate < getTodayStr();
  const isToday = selectedDate === getTodayStr();

  const showCardToast = useCallback((mealType, type, message) => {
    setCardToasts((current) => ({
      ...current,
      [mealType]: { type, message },
    }));
    window.setTimeout(() => {
      setCardToasts((current) => {
        const next = { ...current };
        delete next[mealType];
        return next;
      });
    }, 3000);
  }, []);

  // ✅ Fix 2 & 3: renamed to "streak", checks 7 days, stops early
  const fetchWeeklyStreak = useCallback(async (baseDate) => {
    try {
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const date = shiftDate(baseDate, -i);
        const res = await mealService
          .getMyBookings(date)
          .catch(() => ({ success: false, data: [] }));
        const hasBooking =
          res?.success && res.data?.some((b) => b.status === 'booked');
        if (!hasBooking) break;
        streak += 1;
      }
      setWeeklyStreak(streak);
    } catch {
      setWeeklyStreak(0);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setPageError('');

    try {
      const [bookingsRes, menuRes, rotatingRes] = await Promise.all([
        mealService.getMyBookings(selectedDate),
        mealService
          .getTodayMenu(selectedDate)
          .catch(() => ({ success: false, data: null })),
        mealService
          .getRotatingMenuToday()
          .catch(() => ({ success: false, data: null })),
      ]);

      if (bookingsRes?.success) {
        setBookings(bookingsRes.data ?? []);
      } else {
        setBookings([]);
        setPageError(bookingsRes?.error || 'Failed to load your bookings.');
      }

      setManualMenu(menuRes?.success ? menuRes.data : null);
      setRotatingMenu(rotatingRes?.success ? rotatingRes.data : null);
      fetchWeeklyStreak(selectedDate);
    } catch (error) {
      setPageError(error.message || 'Failed to load dashboard data.');
      setBookings([]);
      setManualMenu(null);
    } finally {
      setLoading(false);
    }
  }, [fetchWeeklyStreak, selectedDate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const bookedMealsCount = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.status === 'booked' &&
          ['breakfast', 'lunch', 'dinner'].includes(b.meal_type)
      ).length,
    [bookings]
  );

  const getBookingForMeal = useCallback(
    (mealType) =>
      bookings.find((b) => b.meal_type === mealType) ?? null,
    [bookings]
  );

  const getMenuForMeal = useCallback(
    (mealType) => {
      const manualItem = manualMenu?.[mealType];
      const rotatingItem = rotatingMenu?.[mealType];
      return {
        text: manualItem || rotatingItem || 'No menu items listed.',
        source: manualItem
          ? 'Kitchen menu'
          : rotatingItem
          ? 'Rotating menu'
          : 'Unavailable',
      };
    },
    [manualMenu, rotatingMenu]
  );

  const handleBook = async (meal) => {
    const previousBookings = bookings;
    const optimisticBooking = {
      id: `optimistic-${meal.id}-${selectedDate}`,
      meal_type: meal.id,
      date: selectedDate,
      status: 'booked',
    };

    setActionLoading((c) => ({ ...c, [meal.id]: true }));
    setBookings((current) => {
      const existing = current.find((b) => b.meal_type === meal.id);
      if (existing) {
        return current.map((b) =>
          b.meal_type === meal.id ? { ...b, status: 'booked' } : b
        );
      }
      return [...current, optimisticBooking];
    });

    try {
      const response = await mealService.bookMeal({
        meal_type: meal.id,
        date: selectedDate,
      });

      if (!response?.success) {
        throw new Error(response?.error || `Could not book ${meal.name}.`);
      }

      setBookings((current) =>
        current.map((b) =>
          b.meal_type === meal.id ? response.data : b
        )
      );
      showCardToast(meal.id, 'success', `${meal.name} booked successfully.`);
      fetchWeeklyStreak(selectedDate);
    } catch (error) {
      setBookings(previousBookings);
      showCardToast(
        meal.id,
        'error',
        error.message || `Could not book ${meal.name}.`
      );
    } finally {
      setActionLoading((c) => ({ ...c, [meal.id]: false }));
    }
  };

  const handleCancel = async (meal, booking) => {
    const previousBookings = bookings;

    setActionLoading((c) => ({ ...c, [meal.id]: true }));
    setBookings((current) =>
      current.map((item) =>
        item.id === booking.id ? { ...item, status: 'cancelled' } : item
      )
    );

    try {
      const response = await mealService.cancelBooking(booking.id);

      if (!response?.success) {
        throw new Error(
          response?.error || `Could not cancel ${meal.name}.`
        );
      }

      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id ? response.data : item
        )
      );
      showCardToast(
        meal.id,
        'success',
        `${meal.name} cancelled successfully.`
      );
      fetchWeeklyStreak(selectedDate);
    } catch (error) {
      setBookings(previousBookings);
      showCardToast(
        meal.id,
        'error',
        error.message || `Could not cancel ${meal.name}.`
      );
    } finally {
      setActionLoading((c) => ({ ...c, [meal.id]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Smart Meal Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View menus and manage bookings for the selected date.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Navigator */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setSelectedDate((d) => shiftDate(d, -1))}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft size={20} />
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-transparent px-2 py-1 font-bold text-sm text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            />

            <button
              onClick={() => setSelectedDate((d) => shiftDate(d, 1))}
              className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Next day"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={() => setSelectedDate(getTodayStr())}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-colors"
          >
            <RotateCcw size={17} />
            Today
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-colors"
          >
            <RefreshCcw size={17} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Page Error */}
      {pageError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="text-sm font-medium">{pageError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">

        {/* Main Content */}
        <div className="space-y-5">

          {/* Date Label */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <CalendarIcon size={17} />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {toDateLabel(selectedDate)}
            </span>
            {isPastDate && (
              <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                Read only
              </span>
            )}
            {isToday && (
              <span className="px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Today
              </span>
            )}
          </div>

          {/* Meal Cards */}
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mr-2" size={22} />
              Loading meals...
            </div>
          ) : (
            // ✅ Fix 1: 2-column grid for 4 cards
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence mode="popLayout">
                {MEAL_CONFIG.map((meal) => {
                  const booking = getBookingForMeal(meal.id);
                  const isBooked = booking?.status === 'booked';
                  const isCancelled = booking?.status === 'cancelled';
                  const status = getMealStatus(meal, selectedDate);
                  const mealStarted = hasMealStarted(meal, selectedDate);
                  const accent = ACCENT_CLASSES[meal.accent];
                  const mealMenu = getMenuForMeal(meal.id);
                  const isCardLoading = !!actionLoading[meal.id];
                  const toast = cardToasts[meal.id];

                  const canBook =
                    !meal.displayOnly &&
                    !isBooked &&
                    status !== 'Closed' &&
                    !isPastDate;
                  const canCancel =
                    !meal.displayOnly &&
                    isBooked &&
                    !mealStarted &&
                    !isPastDate;

                  return (
                    <motion.div
                      layout
                      key={meal.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                      className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm overflow-hidden"
                    >
                      {/* Per-card Toast */}
                      <AnimatePresence>
                        {toast && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className={`mb-4 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${getToastStyles(toast.type)}`}
                          >
                            {toast.type === 'success' ? (
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                            ) : (
                              <XCircle size={15} className="mt-0.5 shrink-0" />
                            )}
                            <span>{toast.message}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className={`p-3 rounded-xl ${accent.icon}`}>
                          <Utensils size={22} />
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${accent.badge}`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* Meal Name & Time */}
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {meal.name}
                          </h3>
                          {isBooked && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 size={12} />
                              Booked
                            </span>
                          )}
                          {isCancelled && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-red-600 dark:text-red-300">
                              <XCircle size={12} />
                              Cancelled
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                          <Clock size={14} />
                          <span>{meal.time}</span>
                        </div>
                      </div>

                      {/* Menu Box */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700 p-4 min-h-[8rem] mb-5">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                            Menu
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                            {mealMenu.source}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {mealMenu.text}
                        </p>
                      </div>

                      {/* Action Button */}
                      {meal.displayOnly ? (
                        <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 py-2.5 text-sm font-semibold text-slate-400 dark:text-slate-500">
                          <Info size={16} />
                          Display only
                        </div>
                      ) : isBooked ? (
                        <button
                          onClick={() => handleCancel(meal, booking)}
                          disabled={!canCancel || isCardLoading}
                          className={`w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold transition-all ${
                            canCancel
                              ? 'border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10'
                              : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 cursor-not-allowed'
                          }`}
                        >
                          {isCardLoading ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <XCircle size={17} />
                          )}
                          {mealStarted || isPastDate
                            ? 'Cancellation Locked'
                            : 'Cancel Booking'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBook(meal)}
                          disabled={!canBook || isCardLoading}
                          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all focus:outline-none focus:ring-4 ${
                            canBook
                              ? accent.button
                              : 'bg-slate-300 dark:bg-slate-700 text-slate-100 dark:text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isCardLoading ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={17} />
                          )}
                          {status === 'Closed' || isPastDate
                            ? 'Booking Closed'
                            : 'Book Meal'}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">

          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Selected Date Summary
            </h3>
            <div className="space-y-4">

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Meals booked
                  </span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {bookedMealsCount}/3
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    <Flame size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    7-day streak
                  </span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {weeklyStreak}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <RefreshCcw size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Rotating menu
                  </span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {rotatingMenu?.week ? `Week ${rotatingMenu.week}` : '—'}
                </span>
              </div>

            </div>
          </div>

          {/* History CTA */}
          <div className="bg-emerald-600 dark:bg-emerald-700 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <History size={20} />
              <h3 className="font-bold">Full Booking History</h3>
            </div>
            <p className="text-sm text-emerald-50 mb-4 leading-relaxed">
              Review past bookings and manage detailed meal records from the history page.
            </p>
            <button
              onClick={() => navigate('/student/booking')}
              className="w-full rounded-xl bg-white text-emerald-700 py-2.5 text-sm font-bold hover:bg-emerald-50 transition-colors"
            >
              Open History
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default StudentDashboard;