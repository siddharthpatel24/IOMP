import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, MessageSquare, Users, RefreshCw } from 'lucide-react';
import { getPolicies, getAllComments } from '../services/firebase';
import SentimentChart from '../components/SentimentChart';
import WordCloudComponent from '../components/WordCloudComponent';

const Dashboard = () => {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalPolicies: 0,
    positive: 0,
    negative: 0,
    neutral: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [policiesData, commentsData] = await Promise.all([
        getPolicies(),
        getAllComments()
      ]);
      
      setPolicies(policiesData);
      setComments(commentsData);
      
      // Calculate stats
      const total = commentsData.length;
      const totalPolicies = policiesData.length;
      const positive = commentsData.filter(c => c.sentiment.toLowerCase() === 'positive').length;
      const negative = commentsData.filter(c => c.sentiment.toLowerCase() === 'negative').length;
      const neutral = commentsData.filter(c => c.sentiment.toLowerCase() === 'neutral').length;
      
      setStats({ total, totalPolicies, positive, negative, neutral });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: t('positive'), value: stats.positive, color: '#22c55e' },
    { name: t('negative'), value: stats.negative, color: '#ef4444' },
    { name: t('neutral'), value: stats.neutral, color: '#3b82f6' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('analyticsTitle')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('analyticsDescription')}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <RefreshCw className="h-5 w-5" />
          <span>{t('refreshData')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">{t('totalPolicies')}</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalPolicies}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">{t('totalFeedback')}</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">{t('positive')}</p>
              <p className="text-3xl font-bold text-green-600">{stats.positive}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">{t('negative')}</p>
              <p className="text-3xl font-bold text-red-600">{stats.negative}</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-medium">{t('neutral')}</p>
              <p className="text-3xl font-bold text-blue-600">{stats.neutral}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('sentimentDistribution')}</h3>
          <SentimentChart data={chartData} />
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Word Cloud</h3>
          <WordCloudComponent comments={comments} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('recentFeedback')}</h3>
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No feedback yet. Citizens haven't commented on policies yet!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.slice(0, 10).map((comment) => (
              <div key={comment.id} className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {(comment.userName || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{comment.userName || 'Anonymous'}</span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">{comment.text.substring(0, 150)}...</p>
                    <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`ml-4 px-2 py-1 rounded text-xs font-semibold ${
                    comment.sentiment.toLowerCase() === 'positive' 
                      ? 'bg-green-100 text-green-800' 
                      : comment.sentiment.toLowerCase() === 'negative'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {t(comment.sentiment.toLowerCase())}
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

export default Dashboard;