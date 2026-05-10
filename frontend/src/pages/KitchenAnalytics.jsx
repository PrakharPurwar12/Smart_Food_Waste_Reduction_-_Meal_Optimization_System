import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Gauge,
  RefreshCcw,
  Scale,
  Target,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getPredictionAnalytics } from '../services/dashboardService';

const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

const formatMeal = (meal) => meal.charAt(0).toUpperCase() + meal.slice(1);

const KitchenAnalytics = () => {
  const [range, setRange] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getPredictionAnalytics(range);
      if (response?.success) {
        setAnalytics(response.data);
      } else {
        setError(response?.error || 'Failed to load analytics.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const kpis = useMemo(() => ([
    {
      label: 'Total Predictions',
      value: analytics?.summary?.total_predictions ?? 0,
      icon: <Activity size={20} />,
      color: '#10B981',
    },
    {
      label: 'Average Error',
      value: analytics?.summary?.average_error ?? 0,
      suffix: 'students',
      icon: <Scale size={20} />,
      color: '#F59E0B',
    },
    {
      label: 'Accuracy',
      value: analytics?.summary?.accuracy_pct ?? 0,
      suffix: '%',
      icon: <Target size={20} />,
      color: '#3B82F6',
    },
    {
      label: 'Waste Saved',
      value: analytics?.summary?.total_waste_saved_kg ?? 0,
      suffix: 'kg',
      icon: <Gauge size={20} />,
      color: '#8B5CF6',
    },
  ]), [analytics?.summary]);

  const trendData = analytics?.accuracy_trend ?? [];
  const wasteData = analytics?.waste_by_day ?? [];
  const radarData = (analytics?.meal_accuracy ?? []).map((item) => ({
    meal: formatMeal(item.meal_type),
    accuracy: item.accuracy_pct,
    error: item.average_error,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Prediction Analytics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track model accuracy, meal-level performance, and estimated waste impact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  range === option.value
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all shadow-sm"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-semibold">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400">
          <AlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">
          Loading prediction analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {kpis.map((item) => (
              <div
                key={item.label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.label}
                  </span>
                  <span
                    className="p-2 rounded-lg"
                    style={{ color: item.color, backgroundColor: `${item.color}18` }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-sm font-semibold text-slate-400">
                      {item.suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-emerald-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Accuracy Trend
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      name="Predicted"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Actual"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Per-Meal Accuracy
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="meal" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Accuracy %"
                      dataKey="accuracy"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.35}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Waste Estimate by Day
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="waste_kg" name="Waste kg" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KitchenAnalytics;
