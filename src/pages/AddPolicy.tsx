import React, { useState } from 'react';
import { Plus, CheckCircle, AlertCircle, FileText, Lock, LogOut } from 'lucide-react';
import { addPolicy, loginAsGovernment, logoutGovernment, getCurrentUser, onAuthStateChange } from '../services/firebase';

const AddPolicy = () => {
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser && (currentUser.email?.endsWith('@gov.in') || currentUser.email?.endsWith('@government.in'))) {
        setShowLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      await loginAsGovernment(email, password);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGovernment();
      setUser(null);
      setShowLogin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await addPolicy(title.trim(), description.trim());
      setSubmitStatus('success');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding policy:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login form if user is not authenticated
  if (!user || (!user.email?.endsWith('@gov.in') && !user.email?.endsWith('@government.in'))) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-2xl shadow-lg mx-auto w-fit mb-4">
              <Lock className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Government Access Only
            </h1>
            <p className="text-gray-600">
              Only authorized government officials can add policies
            </p>
          </div>

          {!showLogin ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                You need to be logged in with a government email address (@gov.in or @government.in) to access this feature.
              </p>
              <button
                onClick={() => setShowLogin(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Login as Government Official
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Government Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@gov.in"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  required
                />
              </div>
              
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {loginError}
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <div></div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Logged in as: <span className="font-semibold">{user.email}</span>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
            <FileText className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Add New <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create a new policy or law proposal for public consultation. Citizens will be able to provide feedback and comments.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Policy Form */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-3">
                Policy Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the policy or law title..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                disabled={isSubmitting}
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-2">
                {title.length}/200 characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-3">
                Policy Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the policy, its objectives, implementation details, and expected impact..."
                className="w-full h-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/50"
                disabled={isSubmitting}
                maxLength={2000}
              />
              <p className="text-sm text-gray-500 mt-2">
                {description.length}/2000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Publishing Policy...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Publish Policy</span>
                </>
              )}
            </button>
          </form>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-semibold">Policy published successfully!</p>
                <p className="text-green-600 text-sm">Citizens can now view and comment on this policy.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-semibold">Failed to publish policy</p>
                <p className="text-red-600 text-sm">Please try again or contact support.</p>
              </div>
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Policy Guidelines</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <span className="text-gray-700">Use clear, concise language that citizens can easily understand</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <span className="text-gray-700">Include specific objectives and expected outcomes</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <span className="text-gray-700">Provide implementation timeline and key milestones</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                <span className="text-gray-700">Explain how the policy will benefit citizens</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-700">Policy appears in the public feed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-700">Citizens can comment and provide feedback</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-700">AI analyzes sentiment and generates insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPolicy;