import { useState } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { generateDarijaResponse } from '../services/api';

export default function ChatInterface() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await generateDarijaResponse(question);
      setResponse(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex items-center justify-center mb-2">
          <MessageCircle className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-3">
          Darija AI Chatbot
        </h1>

        <p className="text-lg md:text-xl text-gray-600 text-center mb-8">
          Ask me anything in Darija 🇲🇦
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="اكتب سؤالك بالدارجة... (Write your question in Darija...)"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none"
              rows={3}
              disabled={isLoading}
              dir="auto"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-6 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
            <h3 className="text-sm font-semibold text-emerald-800 mb-3 uppercase tracking-wide">
              Response
            </h3>
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap" dir="auto">
              {response}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
