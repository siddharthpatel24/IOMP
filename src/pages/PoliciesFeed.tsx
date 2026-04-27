import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { FileText, MessageSquare, Send, Calendar, RefreshCw, ChevronDown, ChevronUp, Users, TrendingUp, Trash2, AlertTriangle } from 'lucide-react';
import { getPolicies, addComment, getComments, deleteComment } from '../services/firebase';
import { analyzeSentiment, summarizeFeedback } from '../services/api';
//import { translatePolicy } from '../services/translation';

interface Policy {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface Comment {
  id: string;
  text: string;
  sentiment: string;
  summary: string;
  confidence: number;
  timestamp: string;
}

const PoliciesFeed = () => {
  const { t, i18n } = useTranslation();
  const [user] = useAuthState(auth);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [translatedPolicies, setTranslatedPolicies] = useState<Policy[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [expandedPolicies, setExpandedPolicies] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [deletingComment, setDeletingComment] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPoliciesAndComments();
  }, []);

  useEffect(() => {
    translatePoliciesContent();
  }, [policies, i18n.language]);

  const translatePoliciesContent = async () => {
    if (policies.length === 0) return;
    
    try {
      const translated = await Promise.all(
        policies.map(policy => translatePolicy(policy, i18n.language))
      );
      setTranslatedPolicies(translated);
    } catch (error) {
      console.error('Error translating policies:', error);
      setTranslatedPolicies(policies); // Fallback to original
    }
  };
  const fetchPoliciesAndComments = async () => {
    try {
      setLoading(true);
      const policiesData = await getPolicies();
      setPolicies(policiesData);

      // Fetch comments for each policy
      const commentsData: Record<string, Comment[]> = {};
      for (const policy of policiesData) {
        const policyComments = await getComments(policy.id);
        commentsData[policy.id] = policyComments;
      }
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (policyId: string) => {
    if (!user) {
      alert(t('loginToComment'));
      return;
    }

    const commentText = newComments[policyId]?.trim();
    if (!commentText) return;

    setSubmitting(prev => ({ ...prev, [policyId]: true }));

    try {
      // Analyze sentiment
      const { sentiment, confidence } = await analyzeSentiment(commentText);
      const summary = commentText.length > 100 ? 
        `User ${sentiment.toLowerCase() === 'positive' ? 'supports' : sentiment.toLowerCase() === 'negative' ? 'opposes' : 'discusses'} the policy with detailed feedback.` :
        commentText.substring(0, 50) + '...';

      // Add comment to Firebase
      const newComment = await addComment(policyId, {
        text: commentText,
        sentiment,
        summary,
        confidence,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        timestamp: new Date().toISOString()
      });

      // Update local state
      setComments(prev => ({
        ...prev,
        [policyId]: [newComment, ...(prev[policyId] || [])]
      }));

      // Clear input
      setNewComments(prev => ({ ...prev, [policyId]: '' }));
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(prev => ({ ...prev, [policyId]: false }));
    }
  };

  const handleDeleteComment = async (policyId: string, commentId: string) => {
    if (!user) return;

    setDeletingComment(commentId);
    try {
      await deleteComment(policyId, commentId);
      
      // Update local state to remove the deleted comment
      setComments(prev => ({
        ...prev,
        [policyId]: prev[policyId]?.filter(comment => comment.id !== commentId) || []
      }));
      
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setDeletingComment(null);
    }
  };

  const handleSummarizeFeedback = async (policyId: string) => {
    const policyComments = comments[policyId] || [];
    if (policyComments.length === 0) {
      alert('No feedback available to summarize. Add some comments first!');
      return;
    }

    setSummarizing(prev => ({ ...prev, [policyId]: true }));

    try {
      const feedbackTexts = policyComments.map(comment => comment.text);
      const summary = await summarizeFeedback(feedbackTexts);
      setSummaries(prev => ({ ...prev, [policyId]: summary }));
    } catch (error) {
      console.error('Error summarizing feedback:', error);
      // Show a more user-friendly error message
      setSummaries(prev => ({ 
        ...prev, 
        [policyId]: 'Unable to generate summary at this time. Please check your API configuration or try again later.' 
      }));
    } finally {
      setSummarizing(prev => ({ ...prev, [policyId]: false }));
    }
  };

  const togglePolicyExpansion = (policyId: string) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
  };

  const toggleCommentsView = (policyId: string) => {
    setShowComments(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '✅';
      case 'negative':
        return '❌';
      default:
        return '⚠️';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('policies')}</h1>
          <p className="text-lg text-gray-600">
            Browse government policies and share your feedback
          </p>
        </div>
        <button
          onClick={fetchPoliciesAndComments}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <RefreshCw className="h-5 w-5" />
          <span>{t('refreshData')}</span>
        </button>
      </div>

      {/* Policies Feed */}
      {translatedPolicies.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Policies Yet</h3>
          <p className="text-gray-500">Government officials haven't posted any policies for consultation yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {translatedPolicies.map((policy, index) => (
            <div key={policy.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Policy Header */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h2 className="text-2xl font-bold text-gray-800 mb-3 flex-1">{policy.title}</h2>
                      <button
                        onClick={() => togglePolicyExpansion(policy.id)}
                        className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        {expandedPolicies[policy.id] ? 
                          <ChevronUp className="h-5 w-5 text-gray-600" /> : 
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        }
                      </button>
                    </div>
                    
                    {/* Policy Stats */}
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{comments[policy.id]?.length || 0} responses</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(policy.createdAt).toLocaleDateString()}</span>
                      </div>
                      {policies[index]?.sentimentDistribution && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>
                            {policies[index].sentimentDistribution.positive > policies[index].sentimentDistribution.negative ? 
                              'Mostly Positive' : 
                              policies[index].sentimentDistribution.negative > policies[index].sentimentDistribution.positive ? 
                              'Mostly Negative' : 'Mixed Response'
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Collapsible Description */}
                    <div className={`transition-all duration-300 overflow-hidden ${
                      expandedPolicies[policy.id] ? 'max-h-none' : 'max-h-20'
                    }`}>
                      <p className="text-gray-600 leading-relaxed mb-4">{policy.description}</p>
                    </div>
                    
                    {!expandedPolicies[policy.id] && policy.description.length > 200 && (
                      <button
                        onClick={() => togglePolicyExpansion(policy.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Read more...
                      </button>
                    )}
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {policies[index]?.createdBy && (
                        <>
                          <span>Published by {policies[index].createdBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* AI Summary Section */}
                {policies[index]?.aiSummary && (
                  <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg mr-3">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      Public Opinion Analysis ({policies[index]?.totalComments || 0} responses)
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3 text-sm">{policies[index]?.aiSummary}</p>
                    
                    {/* Sentiment Distribution */}
                    {policies[index]?.sentimentDistribution && (
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Positive: {policies[index].sentimentDistribution.positive}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Negative: {policies[index].sentimentDistribution.negative}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Neutral: {policies[index].sentimentDistribution.neutral}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="p-6">
                {/* Comments Header with Toggle */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {t('publicFeedback')} ({comments[policy.id]?.length || 0})
                  </h3>
                  <div className="flex items-center space-x-2">
                    {comments[policy.id]?.length > 0 && (
                      <button
                        onClick={() => handleSummarizeFeedback(policy.id)}
                        disabled={summarizing[policy.id]}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {summarizing[policy.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Summarizing...</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4" />
                            <span>Summarize All Feedback</span>
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => toggleCommentsView(policy.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm font-medium"
                    >
                      <span>{showComments[policy.id] ? t('hideComments') : t('viewComments')}</span>
                      {showComments[policy.id] ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </button>
                  </div>
                </div>

                {/* AI Summary Card */}
                {summaries[policy.id] && (
                  <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg mr-3">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">AI Summary</h4>
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        Generated by AI
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{summaries[policy.id]}</p>
                  </div>
                )}

                {/* Comment Input */}
                {user ? (
                  <div className="mb-6">
                    <div className="flex space-x-4">
                      <textarea
                        value={newComments[policy.id] || ''}
                        onChange={(e) => setNewComments(prev => ({ ...prev, [policy.id]: e.target.value }))}
                        placeholder={t('shareThoughts')}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/70"
                        rows={2}
                        disabled={submitting[policy.id]}
                      />
                      <button
                        onClick={() => handleCommentSubmit(policy.id)}
                        disabled={!newComments[policy.id]?.trim() || submitting[policy.id]}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                      >
                        {submitting[policy.id] ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                        <span className="hidden sm:inline">{t('submit')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <p className="text-blue-700 mb-3">{t('loginToComment')}</p>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {t('login')}
                    </Link>
                  </div>
                )}

                {/* Comments List */}
                {showComments[policy.id] && (
                  <div className="space-y-3 max-h-96 overflow-y-auto border-t border-gray-200 pt-4">
                    {comments[policy.id]?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>{t('noFeedbackYet')}</p>
                      </div>
                    ) : (
                      comments[policy.id]?.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start space-x-3">
                            {/* User Avatar */}
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-semibold">
                                {(comment.userName || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Comment Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-semibold text-gray-900">{comment.userName || 'Anonymous'}</span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                </div>
                                
                                {/* Sentiment Tag */}
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(comment.sentiment)}`}>
                                    <span className="mr-1">{getSentimentIcon(comment.sentiment)}</span>
                                    {t(comment.sentiment.toLowerCase())}
                                  </span>
                                  
                                  {/* Delete button - only show for comment owner */}
                                  {user && comment.userId === user.uid && (
                                    <div className="flex items-center">
                                      {showDeleteConfirm === comment.id ? (
                                        <div className="flex items-center space-x-1">
                                          <button
                                            onClick={() => handleDeleteComment(policy.id, comment.id)}
                                            disabled={deletingComment === comment.id}
                                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                                          >
                                            {deletingComment === comment.id ? 'Deleting...' : 'Yes'}
                                          </button>
                                          <button
                                            onClick={() => setShowDeleteConfirm(null)}
                                            className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors duration-200"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setShowDeleteConfirm(comment.id)}
                                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                                          title="Delete your comment"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Comment Text */}
                              <p className="text-gray-800 text-sm leading-relaxed mb-2">{comment.text}</p>
                              
                              {/* Confidence Score */}
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">AI Confidence:</span>
                                <div className="flex items-center space-x-1">
                                  <div className="bg-gray-200 rounded-full h-1.5 w-16">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                                      style={{ width: `${comment.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-medium text-gray-600">{comment.confidence}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoliciesFeed;