import React, { useState } from 'react';
import { User } from 'lucide-react';

const AskForm = ({ user, setView, onQuestionAdded, openAuth }) => {
  const [formData, setFormData] = useState({ title: '', description: '', tags: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center bg-white rounded-3xl border shadow-sm">
        <User className="w-16 h-16 text-orange-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sign in to ask a question</h2>
        <button
          onClick={openAuth}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    try {
      const res = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tags, author: user.username }),
      });
      if (res.ok) {
        onQuestionAdded();
        setView('home');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-black mb-8 tracking-tight">Ask a public question</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-3xl p-8 space-y-6 shadow-sm">
        <input
          required
          className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
          placeholder="What's your question about?"
          value={formData.title}
          onChange={update('title')}
        />
        <textarea
          required
          rows={10}
          className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
          placeholder="Explain your problem in detail..."
          value={formData.description}
          onChange={update('description')}
        />
        <input
          className="w-full border p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
          placeholder="Tags (e.g. javascript, react, mongodb)"
          value={formData.tags}
          onChange={update('tags')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-100 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Posting...' : 'Post Question'}
        </button>
      </form>
    </div>
  );
};

export default AskForm;