import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, MessageSquare, Send, Calendar, ChevronDown, ChevronUp, CheckCircle, CreditCard as Edit3, X, Save } from 'lucide-react';
import { getPolicies, addComment, getOwnComments, updateComment } from '../../services/firebase';
import { analyzeSentiment } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Policy {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  totalComments?: number;
}

interface Comment {
  id: string;
  text: string;
  sentiment: string;
  confidence: number;
  timestamp: string;
  userId: string;
}

const UserHome = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [ownComments, setOwnComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [editingComment, setEditingComment] = useState<{ policyId: string; commentId: string; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const policiesData = await getPolicies();
      setPolicies(policiesData as Policy[]);

      const commentsMap: Record<string, Comment[]> = {};
      for (const policy of policiesData) {
        const c = await getOwnComments(policy.id, user.uid);
        commentsMap[policy.id] = c as Comment[];
      }
      setOwnComments(commentsMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (policyId: string) => {
    const text = newComments[policyId]?.trim();
    if (!text || !user) return;

    setSubmitting(p => ({ ...p, [policyId]: true }));
    try {
      const { sentiment, confidence } = await analyzeSentiment(text);
      const comment = await addComment(policyId, {
        text,
        sentiment,
        confidence,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        timestamp: new Date().toISOString(),
      });
      setOwnComments(p => ({ ...p, [policyId]: [comment as Comment, ...(p[policyId] || [])] }));
      setNewComments(p => ({ ...p, [policyId]: '' }));
      setSubmitted(p => ({ ...p, [policyId]: true }));
      setTimeout(() => setSubmitted(p => ({ ...p, [policyId]: false })), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(p => ({ ...p, [policyId]: false }));
    }
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !user) return;
    const newText = editingComment.text.trim();
    if (!newText) return;
    setSavingEdit(true);
    try {
      await updateComment(editingComment.policyId, editingComment.commentId, newText, user.uid);
      setOwnComments(p => ({
        ...p,
        [editingComment.policyId]: p[editingComment.policyId]?.map(c =>
          c.id === editingComment.commentId ? { ...c, text: newText } : c
        ) || [],
      }));
      setEditingComment(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  const sentimentBadge = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'negative': return 'bg-red-100 text-red-700';
      default: return 'bg-sky-100 text-sky-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Policy Consultation</h1>
        <p className="text-gray-500 mt-1">Browse government policies and share your feedback</p>
      </div>

      {policies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No policies posted yet</p>
          <p className="text-gray-400 text-sm mt-1">Check back soon for new consultation posts</p>
        </div>
      ) : (
        <div className="space-y-6">
          {policies.map(policy => (
            <div key={policy.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-xl font-bold text-gray-900 leading-snug">{policy.title}</h2>
                      <button
                        onClick={() => setExpanded(p => ({ ...p, [policy.id]: !p[policy.id] }))}
                        className="text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
                      >
                        {expanded[policy.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(policy.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>

                    <div className={`mt-3 overflow-hidden transition-all duration-300 ${expanded[policy.id] ? 'max-h-none' : 'max-h-16'}`}>
                      <p className="text-gray-600 text-sm leading-relaxed">{policy.description}</p>
                    </div>
                    {!expanded[policy.id] && policy.description.length > 180 && (
                      <button
                        onClick={() => setExpanded(p => ({ ...p, [policy.id]: true }))}
                        className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                      >
                        Read more
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {submitted[policy.id] && (
                  <div className="mb-4 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-semibold text-sm">Feedback submitted successfully!</p>
                      <p className="text-green-700 text-xs mt-0.5">
                        Your feedback has been recorded and will be reviewed by the authorities.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('shareThoughts')}
                  </label>
                  <textarea
                    value={newComments[policy.id] || ''}
                    onChange={e => setNewComments(p => ({ ...p, [policy.id]: e.target.value }))}
                    placeholder="Share your thoughts on this policy..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    rows={3}
                    disabled={submitting[policy.id]}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleSubmitComment(policy.id)}
                      disabled={!newComments[policy.id]?.trim() || submitting[policy.id]}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting[policy.id] ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {t('submit')}
                    </button>
                  </div>
                </div>

                {(ownComments[policy.id]?.length ?? 0) > 0 && (
                  <div>
                    <button
                      onClick={() => setShowComments(p => ({ ...p, [policy.id]: !p[policy.id] }))}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {showComments[policy.id] ? 'Hide' : 'View'} my feedback ({ownComments[policy.id].length})
                      {showComments[policy.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {showComments[policy.id] && (
                      <div className="mt-4 space-y-3">
                        {ownComments[policy.id].map(comment => (
                          <div key={comment.id} className="bg-slate-50 rounded-xl p-4 border border-gray-100">
                            {editingComment?.commentId === comment.id ? (
                              <div>
                                <textarea
                                  value={editingComment.text}
                                  onChange={e => setEditingComment(ec => ec ? { ...ec, text: e.target.value } : null)}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  rows={3}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    disabled={savingEdit}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    <Save className="h-3.5 w-3.5" />
                                    {savingEdit ? 'Saving...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={() => setEditingComment(null)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-gray-800 text-sm leading-relaxed flex-1">{comment.text}</p>
                                  <button
                                    onClick={() => setEditingComment({ policyId: policy.id, commentId: comment.id, text: comment.text })}
                                    className="text-gray-400 hover:text-blue-600 flex-shrink-0"
                                    title="Edit comment"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sentimentBadge(comment.sentiment)}`}>
                                    {comment.sentiment}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(comment.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
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

export default UserHome;
