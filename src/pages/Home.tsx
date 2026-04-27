import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageSquare, TrendingUp, Users, ArrowRight, Brain, BarChart3, FileText } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('heroTitle')}
          </span>
          <br />
          <span className="text-gray-700">{t('heroSubtitle')}</span>
        </h1>
        {/* <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('heroDescription')}
        </p> */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/policies"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            {t('viewPolicies')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border border-gray-200"
          >
            {t('viewAnalytics')}
            <BarChart3 className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-16 shadow-xl border border-gray-200/50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {t('theChallenge')}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {t('challengeDescription')}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-gray-700">Need for public policy consultation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="text-gray-700">Citizen engagement in governance</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Brain className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-700">AI-powered feedback analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-xl w-fit mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('policyTitle')}</h3>
          <p className="text-gray-600 leading-relaxed">
            Government officials can easily post new policies and laws for public consultation and feedback
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-3 rounded-xl w-fit mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('publicFeedback')}</h3>
          <p className="text-gray-600 leading-relaxed">
            Citizens can easily browse policies and provide meaningful feedback on government initiatives
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-3 rounded-xl w-fit mb-6">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('analyticsTitle')}</h3>
          <p className="text-gray-600 leading-relaxed">
            Advanced sentiment analysis and visual analytics help officials understand public opinion
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Policy Consultation?</h2>
        <p className="text-xl mb-8 opacity-90">
          Start engaging citizens in policy-making with our intelligent platform
        </p>
        <Link
          to="/policies"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          {t('viewPolicies')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default Home;