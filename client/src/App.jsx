import React, { useState, useEffect } from 'react';

import Nav            from './components/Nav';
import Sidebar        from './components/Sidebar';
import AuthModal      from './components/AuthModal';
import AskForm        from './components/AskForm';
import QuestionCard   from './components/QuestionCard';
import QuestionDetail from './components/QuestionDetail';
import Loader     from './components/Loader';
import EmptyState from './components/EmptyState';

const API = 'http://localhost:5000/api';

const App = () => {
  // ── State ──────────────────────────────────────────────────────────────
  const [questions,        setQuestions]        = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [user,             setUser]             = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const [view,        setView]        = useState('home');   // 'home' | 'ask' | 'detail'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType,  setFilterType]  = useState('newest'); // 'newest' | 'popular'
  const [isAuthOpen,  setIsAuthOpen]  = useState(false);
  const [loading,     setLoading]     = useState(true);

  const [answerText,  setAnswerText]  = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────
  const fetchQuestions = async () => {
    try {
      const res  = await fetch(`${API}/questions`);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  // ── Auth ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  // ── Voting ─────────────────────────────────────────────────────────────
  const handleVote = async (id, type) => {
    if (!user) return setIsAuthOpen(true);
    if (type !== 'up') return;

    try {
      const res  = await fetch(`${API}/questions/${id}/vote`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions((prev) => prev.map((q) => q._id === id ? { ...q, votes: data.votes } : q));
        setSelectedQuestion((prev) => prev?._id === id ? { ...prev, votes: data.votes } : prev);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────
  const handleViewDetails = (question) => {
    setSelectedQuestion(question);
    setAnswerText('');
    setView('detail');
  };

  // ── Answers ────────────────────────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (!user)               return setIsAuthOpen(true);
    if (!answerText.trim())  return alert('Write something first!');

    setIsAnswering(true);
    try {
      const res     = await fetch(`${API}/questions/${selectedQuestion._id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: answerText, author: user.username }),
      });
      const updated = await res.json();
      if (res.ok) {
        setSelectedQuestion(updated);
        setQuestions((prev) => prev.map((q) => q._id === updated._id ? updated : q));
        setAnswerText('');
      }
    } catch (err) {
      console.error('Answer failed to post:', err);
    } finally {
      setIsAnswering(false);
    }
  };

  // ── Filtered + sorted question list ───────────────────────────────────
  const displayQuestions = questions
    .filter((q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter((q) => filterType === 'popular' ? q.votes > 5 : true)
    .sort((a, b) =>
      filterType === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : (b.votes || 0) - (a.votes || 0)
    );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans selection:bg-orange-100">

      <Nav
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setView={setView}
        handleAskQuestion={() => setView('ask')}
        onLogout={handleLogout}
        openAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />

      <main className="max-w-6xl mx-auto px-4 py-10">

        {/* ── HOME ── */}
        {view === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <Sidebar view={view} setView={setView} />

            <div className="lg:col-span-3">
              {/* Header + filter */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Community Feed</h1>
                  <p className="text-gray-500 mt-1 font-medium">{displayQuestions.length} discussions found</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                  {['newest', 'popular'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 font-bold rounded-lg text-sm capitalize transition-all ${
                        filterType === type
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question list */}
              {loading ? (
                <Loader />
              ) : (
                <div className="space-y-4">
                  {displayQuestions.length > 0
                    ? displayQuestions.map((q) => (
                        <QuestionCard
                          key={q._id}
                          question={q}
                          onVote={handleVote}
                          onClick={handleViewDetails}
                        />
                      ))
                    : <EmptyState />
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ASK ── */}
        {view === 'ask' && (
          <AskForm
            user={user}
            setView={setView}
            onQuestionAdded={fetchQuestions}
            openAuth={() => setIsAuthOpen(true)}
          />
        )}

        {/* ── DETAIL ── */}
        {view === 'detail' && selectedQuestion && (
          <QuestionDetail
            question={selectedQuestion}
            onVote={handleVote}
            onBack={() => setView('home')}
            answerText={answerText}
            setAnswerText={setAnswerText}
            onSubmitAnswer={handleSubmitAnswer}
            isAnswering={isAnswering}
          />
        )}

      </main>
    </div>
  );
};

export default App;
