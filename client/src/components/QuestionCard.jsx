import React from 'react';
import { ArrowBigUp, Clock, User, MessageCircle } from 'lucide-react';

const QuestionCard = ({ question, onVote, onClick }) => (
  <div
    onClick={() => onClick(question)}
    className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-gray-200/40 transition-all cursor-pointer group"
  >
    <div className="flex gap-6">
      {/* Upvote */}
      <div className="flex flex-col items-center gap-2 bg-gray-50 rounded-2xl p-2 h-fit border border-gray-100">
        <button
          onClick={(e) => { e.stopPropagation(); onVote(question._id, 'up'); }}
          className="text-gray-300 hover:text-orange-500 transition-colors"
        >
          <ArrowBigUp size={28} />
        </button>
        <span className="font-black text-lg text-gray-700">{question.votes || 0}</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
            {question.title}
          </h3>
          {question.votes > 5 && (
            <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
              POPULAR
            </span>
          )}
        </div>

        <p className="text-gray-500 line-clamp-2 leading-relaxed">{question.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {question.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4">

            {/* Answers count */}
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
              question.answers?.length > 0
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-100 text-gray-400'
            }`}>
              <MessageCircle size={13} />
              {question.answers?.length || 0}&nbsp;
              {question.answers?.length === 1 ? 'answer' : 'answers'}
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
              <Clock size={14} />
              {new Date(question.createdAt).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2 text-gray-900 text-xs font-bold bg-orange-50 px-2 py-1 rounded-lg">
              <div className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center text-[10px] text-white">
                {(question.author || 'A').charAt(0).toUpperCase()}
              </div>
              {question.author || 'Anonymous'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default QuestionCard;