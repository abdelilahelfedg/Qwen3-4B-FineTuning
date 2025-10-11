import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center py-8 md:py-12">
      <ChatInterface />

      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Powered by <span className="font-semibold text-emerald-700">Hugging Face</span> & <span className="font-semibold text-emerald-700">Supabase</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
