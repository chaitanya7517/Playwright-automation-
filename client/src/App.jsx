import AutomationForm from './components/AutomationForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Playwright Automation</h1>
        <AutomationForm />
      </div>
    </div>
  );
}

export default App;
