import React from 'react';
import { ArrowBigUp, Clock, User } from 'lucide-react';

const AnswerCard = ({ answer }) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{answer.text}</p>
    <div className="flex items-center gap-2 mt-6 text-xs font-bold text-gray-400">
      <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-white text-[10px]">
        {(answer.author || 'A').charAt(0).toUpperCase()}
      </div>
      {answer.author || 'Anonymous'}
      {answer.createdAt && (
        <span className="ml-2 flex items-center gap-1">
          <Clock size={12} />
          {new Date(answer.createdAt).toLocaleDateString()}
        </span>
      )}
    </div>
  </div>
);

const QuestionDetail = ({ question, onVote, onBack, answerText, setAnswerText, onSubmitAnswer, isAnswering }) => (
  <div className="max-w-4xl mx-auto">
    {/* Back */}
    <button
      onClick={onBack}
      className="mb-6 text-orange-600 text-sm font-bold hover:underline flex items-center gap-2 group"
    >
      <span className="group-hover:-translate-x-1 transition-transform">←</span>
      Back to Discussions
    </button>

    {/* Question body */}
    <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
      <div className="flex items-start gap-6">
        {/* Upvote */}
        <div className="flex flex-col items-center gap-2 bg-gray-50 rounded-2xl p-2 h-fit border border-gray-100">
          <button
            onClick={() => onVote(question._id, 'up')}
            className="text-gray-300 hover:text-orange-500 transition-colors"
          >
            <ArrowBigUp size={28} />
          </button>
          <span className="font-black text-lg text-gray-700">{question.votes || 0}</span>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{question.title}</h1>
          <div className="flex flex-wrap gap-6 mb-10 text-xs font-bold text-gray-400 border-b pb-6">
            <span className="flex items-center gap-2">
              <Clock size={14} /> Asked {new Date(question.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-2">
              <User size={14} /> By {question.author}
            </span>
          </div>
          <p className="text-gray-800 leading-relaxed text-xl whitespace-pre-wrap">{question.description}</p>
        </div>
      </div>
    </div>

    {/* Answers list */}
    {question.answers?.length > 0 && (
      <div className="mt-10">
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
        </h2>
        <div className="space-y-4">
          {question.answers.map((ans, i) => (
            <AnswerCard key={i} answer={ans} />
          ))}
        </div>
      </div>
    )}

    {/* Post answer */}
    <div className="mt-12">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Know the answer?</h2>
      <textarea
        className="w-full border-gray-200 border rounded-3xl p-6 focus:ring-2 focus:ring-orange-500 outline-none mb-4 min-h[200px] font-medium"
        placeholder="Write your detailed answer here..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
      />
      <button
        disabled={isAnswering}
        onClick={onSubmitAnswer}
        className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-2xl font-black transition-all disabled:opacity-50"
      >
        {isAnswering ? 'POSTING...' : 'POST YOUR ANSWER'}
      </button>
    </div>
  </div>
);

export default QuestionDetail;