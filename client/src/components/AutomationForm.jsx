// client/src/components/AutomationForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import UrlSelector from './UrlSelector';
import FolderSelector from './FolderSelector';
import MessageDisplay from './MessageDisplay';

const AutomationForm = () => {
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('test.spec.js');
  const [projectType, setProjectType] = useState('b2c');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [existingFolders, setExistingFolders] = useState(['b2c', 'b2b', 'drx', 'labs']);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [urlPresets, setUrlPresets] = useState([]);
  const [newUrlName, setNewUrlName] = useState('');

  const isNewUrl = url && !urlPresets.some(preset => preset.url === url);

  useEffect(() => {
    const savedUrls = JSON.parse(localStorage.getItem('urlPresets')) || [
      { name: 'Deepseek', url: 'https://www.deepseek.com' },
      { name: 'HRX Web', url: 'https://www.hrxweb.com' }
    ];
    setUrlPresets(savedUrls);
  }, []);

  const projectOptions = [
    { value: 'b2c', label: 'B2C' },
    { value: 'b2b', label: 'B2B' },
    { value: 'drx', label: 'DRX' },
    { value: 'labs', label: 'Labs' },
  ];

  const handleSaveUrl = () => {
    if (url && newUrlName) {
      const newPreset = { name: newUrlName, url };
      const updatedPresets = [...urlPresets, newPreset];
      
      setUrlPresets(updatedPresets);
      localStorage.setItem('urlPresets', JSON.stringify(updatedPresets));
      setNewUrlName('');
      setMessage('URL saved successfully!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let folder = selectedFolder;
    if (folder === 'new') {
      folder = newFolder.trim();
      if (!folder) {
        setMessage('Please enter a valid folder name.');
        return;
      }
    }

    // Ensure filename ends with .spec.js
    if (!filename.endsWith('.spec.js')) {
      setFilename(prev => `${prev}.spec.js`);
    }

    setIsRunning(true);
    setMessage('Starting automation...');

    try {
      const response = await axios.post('http://localhost:3001/api/start', {
        url,
        filename,
        projectType,
        folder
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
      setMessage(`Automation stopped. Code saved to ${selectedFolder}/${filename}`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to stop automation');
    }
    setIsRunning(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Project Type Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Type
        </label>
        <select
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {projectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Folder Selection */}
      <FolderSelector
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        existingFolders={existingFolders}
        newFolder={newFolder}
        setNewFolder={setNewFolder}
      />

      {/* URL Selection */}
      <UrlSelector
        url={url}
        setUrl={setUrl}
        urlPresets={urlPresets}
      />

      {/* Save URL Section - Only shows for new URLs */}
      {isNewUrl && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newUrlName}
            onChange={(e) => setNewUrlName(e.target.value)}
            placeholder="Name for this URL"
            className="flex-1 p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleSaveUrl}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            disabled={!newUrlName}
          >
            Save
          </button>
        </div>
      )}

      {/* Filename Input */}
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
          placeholder="test.spec.js"
        />
      </div>
      
      {/* Control Buttons */}
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

      {/* Message Display */}
      <MessageDisplay message={message} />
    </form>
  );
};

export default AutomationForm;
