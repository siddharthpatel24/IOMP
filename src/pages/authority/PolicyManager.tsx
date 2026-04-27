import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, CreditCard as Edit3, Trash2, ChevronDown, ChevronUp, MessageSquare, TrendingUp, X, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import {
  getPolicies, addPolicy, updatePolicy, deletePolicy,
  getComments
} from '../../services/firebase';
import { summarizeFeedback } from '../../services/api';
import SentimentChart from '../../components/SentimentChart';
import WordCloudComponent from '../../components/WordCloudComponent';
import { useAuth } from '../../context/AuthContext';

interface Policy {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  totalComments?: number;
  aiSummary?: string;
  sentimentDistribution?: { positive: number; negative: number; neutral: number };
}

const PolicyManager = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedDesc, setExpandedDesc] = useState<Record<string, boolean>>({});

  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pData = await getPolicies();
      setPolicies(pData as Policy[]);

      const cMap: Record<string, any[]> = {};
      for (const p of pData) {
        cMap[p.id] = await getComments(p.id);
      }
      setComments(cMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    setSubmitting(true);
    setFormStatus('idle');
    try {
      await addPolicy(newTitle.trim(), newDesc.trim());
      setFormStatus('success');
      setNewTitle('');
      setNewDesc('');
      setShowForm(false);
      await fetchData();
    } catch {
      setFormStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (policy: Policy) => {
    setEditingId(policy.id);
    setEditTitle(policy.title);
    setEditDesc(policy.description);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editTitle.trim() || !editDesc.trim()) return;
    setSavingEdit(true);
    try {
      await updatePolicy(editingId, editTitle.trim(), editDesc.trim());
      setPolicies(ps => ps.map(p => p.id === editingId ? { ...p, title: editTitle.trim(), description: editDesc.trim() } : p));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (policyId: string) => {
    setDeleting(true);
    try {
      await deletePolicy(policyId);
      setPolicies(ps => ps.filter(p => p.id !== policyId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleSummarize = async (policyId: string) => {
    const policyComments = comments[policyId] || [];
    if (policyComments.length === 0) return;
    setSummarizing(p => ({ ...p, [policyId]: true }));
    try {
      const texts = policyComments.map((c: any) => c.text);
      const summary = await summarizeFeedback(texts);
      setSummaries(p => ({ ...p, [policyId]: summary }));
    } catch (err) {
      console.error(err);
    } finally {
      setSummarizing(p => ({ ...p, [policyId]: false }));
    }
  };

  const sentimentBadge = (s: string) => {
    switch (s?.toLowerCase()) {
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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-500 mt-1">Create and manage consultation policies</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 text-sm transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => { setShowForm(v => !v); setFormStatus('idle'); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Policy
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Add New Policy</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAddPolicy} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Enter the policy title..."
                maxLength={200}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Description</label>
              <textarea
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Describe the policy in detail..."
                maxLength={2000}
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                required
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{newDesc.length}/2000</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || !newTitle.trim() || !newDesc.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Plus className="h-4 w-4" />}
                Publish Policy
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors">
                Cancel
              </button>
            </div>

            {formStatus === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                <CheckCircle className="h-4 w-4" /> Policy published successfully!
              </div>
            )}
            {formStatus === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="h-4 w-4" /> Failed to publish. Please try again.
              </div>
            )}
          </form>
        </div>
      )}

      {policies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No policies yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "New Policy" to post the first consultation</p>
        </div>
      ) : (
        <div className="space-y-6">
          {policies.map(policy => (
            <div key={policy.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                {editingId === policy.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-blue-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                    />
                    <textarea
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-blue-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={savingEdit}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {savingEdit ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="bg-blue-600 p-2.5 rounded-xl flex-shrink-0 mt-0.5">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold text-gray-900">{policy.title}</h2>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                            <span>{new Date(policy.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3.5 w-3.5" />
                              {comments[policy.id]?.length || 0} responses
                            </span>
                          </div>
                          <div className={`mt-3 overflow-hidden transition-all ${expandedDesc[policy.id] ? '' : 'max-h-14'}`}>
                            <p className="text-gray-600 text-sm leading-relaxed">{policy.description}</p>
                          </div>
                          {policy.description.length > 200 && (
                            <button
                              onClick={() => setExpandedDesc(p => ({ ...p, [policy.id]: !p[policy.id] }))}
                              className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                            >
                              {expandedDesc[policy.id] ? 'Show less' : 'Read more'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(policy)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit policy"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {deleteConfirm === policy.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(policy.id)}
                              disabled={deleting}
                              className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
                            >
                              {deleting ? '...' : 'Yes'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(policy.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete policy"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {policy.sentimentDistribution && policy.totalComments && policy.totalComments > 0 && (
                      <div className="mt-4 flex items-center gap-2 text-xs">
                        <div className="flex-1 h-2 rounded-full overflow-hidden flex bg-gray-100">
                          <div className="bg-green-500 h-full" style={{ width: `${(policy.sentimentDistribution.positive / policy.totalComments) * 100}%` }} />
                          <div className="bg-red-500 h-full" style={{ width: `${(policy.sentimentDistribution.negative / policy.totalComments) * 100}%` }} />
                          <div className="bg-sky-400 h-full" style={{ width: `${(policy.sentimentDistribution.neutral / policy.totalComments) * 100}%` }} />
                        </div>
                        <span className="text-green-600 font-medium">{policy.sentimentDistribution.positive}+</span>
                        <span className="text-red-500 font-medium">{policy.sentimentDistribution.negative}-</span>
                        <span className="text-sky-500 font-medium">{policy.sentimentDistribution.neutral}~</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {(summaries[policy.id] || policy.aiSummary) && (
                <div className="px-6 pt-4 pb-0">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">AI Analysis Summary</span>
                    </div>
                    <p className="text-blue-700 text-sm leading-relaxed">{summaries[policy.id] || policy.aiSummary}</p>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setExpandedComments(p => ({ ...p, [policy.id]: !p[policy.id] }))}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
                  >
                    <MessageSquare className="h-4 w-4" />
                    All Citizen Feedback ({comments[policy.id]?.length || 0})
                    {expandedComments[policy.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {(comments[policy.id]?.length ?? 0) > 0 && (
                    <button
                      onClick={() => handleSummarize(policy.id)}
                      disabled={summarizing[policy.id]}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {summarizing[policy.id] ? (
                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                      ) : (
                        <TrendingUp className="h-3.5 w-3.5" />
                      )}
                      {summarizing[policy.id] ? 'Summarizing...' : 'AI Summarize'}
                    </button>
                  )}
                </div>

                {expandedComments[policy.id] && (
                  <div>
                    {comments[policy.id]?.length > 0 && (
                      <div className="mb-5 grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sentiment Chart</p>
                          <SentimentChart data={[
                            { name: 'Positive', value: comments[policy.id].filter(c => c.sentiment?.toLowerCase() === 'positive').length, color: '#22c55e' },
                            { name: 'Negative', value: comments[policy.id].filter(c => c.sentiment?.toLowerCase() === 'negative').length, color: '#ef4444' },
                            { name: 'Neutral', value: comments[policy.id].filter(c => c.sentiment?.toLowerCase() === 'neutral').length, color: '#3b82f6' },
                          ]} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Word Cloud</p>
                          <WordCloudComponent comments={comments[policy.id]} />
                        </div>
                      </div>
                    )}

                    {comments[policy.id]?.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No feedback yet on this policy</div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {comments[policy.id].map((c: any) => (
                          <div key={c.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{(c.userName || 'U').charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-800">{c.userName || 'Anonymous'}</span>
                                <span className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{c.text}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sentimentBadge(c.sentiment)}`}>
                                  {c.sentiment}
                                </span>
                                <span className="text-xs text-gray-400">Confidence: {c.confidence}%</span>
                              </div>
                            </div>
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

export default PolicyManager;
