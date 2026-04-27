import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, MessageSquare, TrendingUp, FileText, RefreshCw, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPolicies, getAllComments } from '../../services/firebase';
import SentimentChart from '../../components/SentimentChart';
import WordCloudComponent from '../../components/WordCloudComponent';

const AuthorityDashboard = () => {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPolicies: 0, total: 0, positive: 0, negative: 0, neutral: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([getPolicies(), getAllComments()]);
      setPolicies(pData);
      setComments(cData);
      const total = cData.length;
      const positive = cData.filter((c: any) => c.sentiment?.toLowerCase() === 'positive').length;
      const negative = cData.filter((c: any) => c.sentiment?.toLowerCase() === 'negative').length;
      const neutral = cData.filter((c: any) => c.sentiment?.toLowerCase() === 'neutral').length;
      setStats({ totalPolicies: pData.length, total, positive, negative, neutral });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const chartData = [
    { name: t('positive'), value: stats.positive, color: '#22c55e' },
    { name: t('negative'), value: stats.negative, color: '#ef4444' },
    { name: t('neutral'), value: stats.neutral, color: '#3b82f6' },
  ];

  const statCards = [
    { label: 'Total Policies', value: stats.totalPolicies, icon: FileText, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700' },
    { label: 'Total Feedback', value: stats.total, icon: MessageSquare, color: 'bg-slate-500', light: 'bg-slate-50 text-slate-700' },
    { label: 'Positive', value: stats.positive, icon: TrendingUp, color: 'bg-green-500', light: 'bg-green-50 text-green-700' },
    { label: 'Negative', value: stats.negative, icon: BarChart3, color: 'bg-red-500', light: 'bg-red-50 text-red-700' },
    { label: 'Neutral', value: stats.neutral, icon: MessageSquare, color: 'bg-sky-500', light: 'bg-sky-50 text-sky-700' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('analyticsTitle')}</h1>
          <p className="text-gray-500 mt-1">{t('analyticsDescription')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <Link
            to="/authority/policies"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Manage Policies
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, light }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
              <div className={`${color} p-2 rounded-lg`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className={`text-2xl font-bold ${light.split(' ')[1]}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">{t('sentimentDistribution')}</h3>
          <SentimentChart data={chartData} />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Feedback Word Cloud</h3>
          <WordCloudComponent comments={comments} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Citizen Feedback</h3>
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No feedback submitted yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {comments.slice(0, 15).map((c: any) => (
              <div key={c.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {(c.userName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{c.userName || 'Anonymous'}</span>
                    <span className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{c.text}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  c.sentiment?.toLowerCase() === 'positive'
                    ? 'bg-green-100 text-green-700'
                    : c.sentiment?.toLowerCase() === 'negative'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-sky-100 text-sky-700'
                }`}>
                  {c.sentiment}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;
