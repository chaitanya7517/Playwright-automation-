import { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('test.js');
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    setMessage('Starting automation...');
    
    try {
      const response = await axios.post('http://localhost:3001/api/start', {
        url,
        filename
      });
      setMessage('Automation started! Interact with the browser window...');
    } catch (error) {
      setIsRunning(false);
      setMessage(error.response?.data?.error || 'Failed to start automation');
    }
  };

  const handleStop = async () => {
    try {
      await axios.post('http://localhost:3001/api/stop');
      setMessage('Automation stopped. Code saved to ' + filename);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to stop automation');
    }
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Playwright Automation
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="test.js"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isRunning}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Start Automation
            </button>
            
            <button
              type="button"
              onClick={handleStop}
              disabled={!isRunning}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              Stop Automation
            </button>
          </div>
        </form>
        
        {message && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


