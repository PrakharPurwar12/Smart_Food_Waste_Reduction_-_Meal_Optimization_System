import { useState, useEffect, useCallback } from 'react';
import {
  Utensils, RefreshCcw, Save, Sparkles, Calendar,
  TrendingUp, ChartBar, Clock, Users, Leaf,
  ChevronRight, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import mealService from '../services/mealService';
import { generatePrediction } from '../services/dashboardService';
import Button from '../components/Button';

// ── Helpers ─────────────────────────────────────────────────
const getMealStatus = (mealType) => {
  const now = new Date();
  const h = now.getHours();
  const RANGES = {
    breakfast: [7, 9],
    lunch: [12, 14],
    dinner: [19, 21],
  };
  const [start, end] = RANGES[mealType] ?? [0, 0];
  if (h < start) return 'Upcoming';
  if (h >= start && h < end) return 'Ongoing';
  return 'Closed';
};

const STATUS_STYLES = {
  Upcoming: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30',
  Ongoing:  'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30',
  Closed:   'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

const MEAL_CONFIG = [
  { id: 'breakfast', label: 'Breakfast', time: '07:30 – 09:00', color: '#F59E0B', accent: 'amber' },
  { id: 'lunch',     label: 'Lunch',     time: '12:30 – 14:00', color: '#10B981', accent: 'emerald' },
  { id: 'dinner',    label: 'Dinner',    time: '19:30 – 21:00', color: '#3B82F6', accent: 'blue' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ── Sub-components ───────────────────────────────────────────

const SectionHeader = ({ title, description }) => (
  <div className="mb-5">
    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
    {description && (
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
    )}
  </div>
);

const MealCard = ({ meal, count }) => {
  const status = getMealStatus(meal.id);
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${meal.color}15`, color: meal.color }}
        >
          <Utensils size={22} />
        </div>
        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
          {meal.label}
        </p>
        <p className="text-5xl font-bold text-slate-900 dark:text-white leading-none">
          {count}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
          <Clock size={12} />
          {meal.time}
        </p>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        students booked
      </p>
    </div>
  );
};

const FoodQuantityCard = ({ emoji, label, quantity, unit }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
    </div>
    <span className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">
      {quantity} <span className="text-sm font-medium text-slate-400">{unit}</span>
    </span>
  </div>
);

// ── Main Component ───────────────────────────────────────────

const KitchenDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [menu, setMenu] = useState({ breakfast: '', lunch: '', snacks: '', dinner: '' });
  const [loading, setLoading] = useState(true);
  const [menuSaving, setMenuSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [rotatingMenu, setRotatingMenu] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [fullSchedule, setFullSchedule] = useState(null);
  const [menuExpanded, setMenuExpanded] = useState(false);

  const getTodayStr = () => new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(getTodayStr());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, menuRes, rotatingRes] = await Promise.all([
        mealService.getMealStats(selectedDate),
        mealService.getTodayMenu(selectedDate).catch(() => ({ success: false })),
        mealService.getRotatingMenuToday().catch(() => ({ success: false })),
      ]);

      setStats(statsRes?.success ? statsRes.data : { breakfast: 0, lunch: 0, dinner: 0 });

      if (menuRes?.success && menuRes?.data) {
        setMenu({
          breakfast: menuRes.data.breakfast || '',
          lunch:     menuRes.data.lunch     || '',
          snacks:    menuRes.data.snacks    || '',
          dinner:    menuRes.data.dinner    || '',
        });
      } else {
        setMenu({ breakfast: '', lunch: '', snacks: '', dinner: '' });
      }

      if (rotatingRes?.success && rotatingRes?.data) {
        setRotatingMenu(rotatingRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch kitchen data', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAutoFill = () => {
    if (!rotatingMenu) return;
    setMenu({
      breakfast: rotatingMenu.breakfast,
      lunch:     rotatingMenu.lunch,
      snacks:    rotatingMenu.snacks,
      dinner:    rotatingMenu.dinner,
    });
    setMessage('Menu auto-filled from rotating schedule!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleViewSchedule = async () => {
    if (fullSchedule) { setShowSchedule(!showSchedule); return; }
    try {
      const res = await mealService.getFullSchedule();
      if (res?.success) { setFullSchedule(res.data); setShowSchedule(true); }
    } catch (err) {
      console.error('Failed to load schedule', err);
    }
  };

  const handleSaveMenu = async () => {
    setMenuSaving(true);
    setMessage('');
    try {
      const response = await mealService.uploadMenu({ ...menu, date: selectedDate });
      if (response?.success) {
        setMessage('Menu saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save menu', err);
      setMessage('Failed to save menu');
    } finally {
      setMenuSaving(false);
    }
  };

  const handleGeneratePrediction = async () => {
    setPredictionLoading(true);
    try {
      const day = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });
      const res = await generatePrediction({ day });
      setPrediction(res?.data ?? res);
    } catch (err) {
      console.error('Prediction failed', err);
    } finally {
      setPredictionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mr-3" />
        Loading kitchen dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Kitchen Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date selector */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all shadow-sm text-sm font-semibold"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Rotating Menu Banner ─────────────────────────── */}
      {rotatingMenu && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg shrink-0">
              <Calendar size={17} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Week {rotatingMenu.week} — {rotatingMenu.day}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500">
                Rotating schedule loaded
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleAutoFill}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all"
            >
              <Sparkles size={15} />
              Auto-fill Menu
            </button>
            <button
              onClick={handleViewSchedule}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-all"
            >
              {showSchedule ? 'Hide' : 'View'} Schedule
            </button>
          </div>
        </div>
      )}

      {/* ── Full Schedule Table ──────────────────────────── */}
      {showSchedule && fullSchedule && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <div className="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              2-Week Rotating Menu Schedule
            </h3>
            {['Week A', 'Week B'].map((week) => (
              <div key={week} className="mb-6">
                <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                  {week}
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                      {['Day', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((h) => (
                        <th key={h} className="pb-2 pr-4 text-slate-500 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => {
                      const entry = fullSchedule[week]?.[day];
                      if (!entry) return null;
                      return (
                        <tr key={day} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{day}</td>
                          <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{entry.breakfast}</td>
                          <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{entry.lunch}</td>
                          <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{entry.snacks}</td>
                          <td className="py-2 text-slate-600 dark:text-slate-400">{entry.dinner}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 1: TODAY'S MEALS ─────────────────────── */}
      <section>
        <SectionHeader
          title="Today's Meal Bookings"
          description="Live student booking counts for each meal"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {MEAL_CONFIG.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              count={stats[meal.id] ?? 0}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION 2: PREDICTION SUMMARY ───────────────── */}
      <section>
        <SectionHeader
          title="Smart Prediction"
          description="AI-generated attendance forecast for meal planning"
        />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {prediction
                    ? `Forecast for ${prediction.day}`
                    : 'No forecast generated yet'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {prediction
                    ? `Based on ${prediction.data_points} data point${prediction.data_points !== 1 ? 's' : ''}`
                    : 'Click Generate to run the AI model'}
                </p>
              </div>
            </div>
            <Button onClick={handleGeneratePrediction} isLoading={predictionLoading}>
              Generate Prediction
            </Button>
          </div>

          {prediction && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Expected Students */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    Expected Students
                  </p>
                </div>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {prediction.predicted}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                  total attendance
                </p>
              </div>

              {/* Confidence */}
              <div className={`rounded-xl p-4 border ${
                prediction.confidence === 'High'
                  ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30'
                  : prediction.confidence === 'Medium'
                  ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30'
                  : 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30'
              }`}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-slate-500 dark:text-slate-400">
                  Confidence
                </p>
                <p className={`text-3xl font-bold ${
                  prediction.confidence === 'High'
                    ? 'text-blue-700 dark:text-blue-300'
                    : prediction.confidence === 'Medium'
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {prediction.confidence}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  prediction reliability
                </p>
              </div>

              {/* Waste Reduction */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf size={15} className="text-slate-500 dark:text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Data Source
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                  {prediction.data_source === 'booking_history'
                    ? 'Real booking data'
                    : prediction.data_source === 'prediction_history'
                    ? 'Historical predictions'
                    : 'Default estimate'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {prediction.data_source === 'booking_history'
                    ? '✅ High accuracy'
                    : '⚠️ Limited data'}
                </p>
              </div>
            </div>
          )}

          {/* Per meal breakdown */}
          {prediction?.per_meal && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">
                Per Meal Forecast
              </p>
              <div className="grid grid-cols-3 gap-3">
                {MEAL_CONFIG.map(({ id, label, color }) => (
                  <div
                    key={id}
                    className="rounded-xl p-3 text-center"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                    <p className="text-xl font-bold" style={{ color }}>
                      {prediction.per_meal[id] ?? '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 3: FOOD QUANTITIES ───────────────────── */}
      {prediction?.food_plan && (
        <section>
          <SectionHeader
            title="Recommended Food Quantities"
            description="Prepare these quantities based on today's predicted attendance"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FoodQuantityCard
              emoji="🍚"
              label="Rice"
              quantity={prediction.food_plan.rice_kg}
              unit="kg"
            />
            <FoodQuantityCard
              emoji="🫘"
              label="Dal"
              quantity={prediction.food_plan.dal_kg}
              unit="kg"
            />
            <FoodQuantityCard
              emoji="🫓"
              label="Chapati"
              quantity={prediction.food_plan.chapati_count}
              unit="pcs"
            />
            {/* Additional estimated quantities */}
            <FoodQuantityCard
              emoji="🥛"
              label="Milk / Chai"
              quantity={Math.round((prediction.predicted ?? 0) * 0.25)}
              unit="litres"
            />
            <FoodQuantityCard
              emoji="🫙"
              label="Cooking Oil"
              quantity={Math.round((prediction.predicted ?? 0) * 0.05)}
              unit="litres"
            />
            <FoodQuantityCard
              emoji="🥬"
              label="Vegetables"
              quantity={Math.round((prediction.predicted ?? 0) * 0.15)}
              unit="kg"
            />
          </div>
        </section>
      )}

      {/* ── SECTION 4: QUICK MENU ACTIONS ───────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <SectionHeader
            title="Daily Menu"
            description="Set or update today's mess menu"
          />
          <button
            onClick={() => setMenuExpanded(!menuExpanded)}
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            {menuExpanded ? 'Collapse' : 'Edit Menu'}
            <ChevronRight size={15} className={`transition-transform ${menuExpanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          {/* Quick action row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {rotatingMenu && (
              <button
                onClick={handleAutoFill}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
              >
                <Sparkles size={15} />
                Auto-fill Week {rotatingMenu.week}
              </button>
            )}
            <Button onClick={handleSaveMenu} isLoading={menuSaving}>
              <Save size={16} />
              Save Menu
            </Button>
          </div>

          {/* Message */}
          {message && (
            <p className={`text-sm font-medium mb-4 ${
              message.includes('Failed') ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {message}
            </p>
          )}

          {/* Menu fields — collapsed by default, expandable */}
          {menuExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'breakfast', label: '🌅 Breakfast' },
                { key: 'lunch',     label: '☀️ Lunch' },
                { key: 'snacks',    label: '🫖 Snacks' },
                { key: 'dinner',    label: '🌙 Dinner' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  <textarea
                    placeholder={`Enter ${key} items…`}
                    value={menu[key]}
                    onChange={(e) => setMenu({ ...menu, [key]: e.target.value })}
                    rows={2}
                    className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Preview when collapsed */}
          {!menuExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
                { key: 'lunch',     label: 'Lunch',     emoji: '☀️' },
                { key: 'snacks',    label: 'Snacks',    emoji: '🫖' },
                { key: 'dinner',    label: 'Dinner',    emoji: '🌙' },
              ].map(({ key, label, emoji }) => (
                <div
                  key={key}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
                >
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                    {emoji} {label}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {menu[key] || 'Not set'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 5: ANALYTICS ACCESS ─────────────────── */}
      <section>
        <div
          onClick={() => navigate('/kitchen/analytics')}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex items-center justify-between cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
              <BarChart2 size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                Prediction Analytics
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                View accuracy trends, waste estimates, and meal-level performance
              </p>
            </div>
          </div>
          <ChevronRight
            size={20}
            className="text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
          />
        </div>
      </section>

    </div>
  );
};

export default KitchenDashboard;