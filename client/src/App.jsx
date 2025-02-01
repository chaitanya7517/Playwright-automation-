import {useState, useEffect} from 'react';
import axios from 'axios';
import path from 'path-browserify';

function App() {
    const [url, setUrl] = useState('');
    const [filename, setFilename] = useState('test.spec.js');
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState('');
    const [urlPresets, setUrlPresets] = useState([]);
    const [newUrlName, setNewUrlName] = useState('');
    const [projects, setProjects] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedProject, setSelectedProject] = useState('b2c');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [testResults, setTestResults] = useState('');
    const [isAllSelected, setIsAllSelected] = useState(false);

    // Check if current URL is new/unsaved
    const isNewUrl = url && !urlPresets.some(preset => preset.url === url);

    // Load saved URLs on component mount
    useEffect(() => {
        const savedUrls = JSON.parse(localStorage.getItem('urlPresets')) || [
            {name: 'Deepseek', url: 'https://www.deepseek.com'},
            {name: 'HRX Web', url: 'https://www.hrxweb.com'}
        ];
        setUrlPresets(savedUrls);
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/projects')
            .then(res => setProjects(res.data))
            .catch(console.error);

        loadFiles(selectedProject);
    }, []);

    const loadFiles = (project) => {
        axios.get(`http://localhost:3001/api/files/${project}`)
            .then(res => setFiles(res.data))
            .catch(console.error);
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        loadFiles(project);
    };

    const handleSaveUrl = () => {
        if (url && newUrlName) {
            const newPreset = {name: newUrlName, url};
            const updatedPresets = [...urlPresets, newPreset];

            setUrlPresets(updatedPresets);
            localStorage.setItem('urlPresets', JSON.stringify(updatedPresets));
            setNewUrlName('');
            setMessage('URL saved successfully!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsRunning(true);
        setMessage('Starting automation...');

        // Validate and enforce .spec.js extension
        let adjustedFilename = filename;
        if (!adjustedFilename.endsWith('.spec.js')) {
            adjustedFilename = adjustedFilename.replace(/\.js$/, '') + '.spec.js';
            setFilename(adjustedFilename);
        }

        try {
            const response = await axios.post('http://localhost:3001/api/start', {
                url,
                filename: adjustedFilename,
                projectType: selectedProject
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
            setMessage(`Automation stopped. Code saved to ${selectedProject}/${filename}`);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to stop automation');
        }
        setIsRunning(false);
    };

    // Toggle individual file selection
    const toggleFile = (file) => {
        setSelectedFiles(prev =>
            prev.includes(file)
                ? prev.filter(f => f !== file)
                : [...prev, file]
        );
    };

    // Toggle all files selection
    const toggleAllFiles = () => {
        if (isAllSelected) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(files.map(file => path.join('scripts', selectedProject, file)));
        }
        setIsAllSelected(!isAllSelected);
    };

    // Run selected tests
    const handleRunTests = async () => {
        if (selectedFiles.length === 0) {
            setMessage('Please select at least one file to run');
            return;
        }

        try {
            setMessage('Running tests...');
            const response = await axios.post('http://localhost:3001/api/run-tests', {
                files: selectedFiles
            });

            setTestResults(
                response.data.error
                    ? `Error: ${response.data.error}\n${response.data.output}`
                    : response.data.output
            );
            setMessage('Tests completed!');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to run tests');
        }
    };

    // Show test report
    const handleShowReport = async () => {
        try {
            await axios.get('http://localhost:3001/api/show-report');
            setMessage('Report should open in your default browser');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Failed to show report');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Project Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
                <h2 className="text-lg font-semibold mb-4">Projects</h2>
                <ul className="space-y-1">
                    {projects.map(project => (
                        <li
                            key={project}
                            onClick={() => handleProjectSelect(project)}
                            className={`p-2 rounded cursor-pointer ${selectedProject === project
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'}`}
                        >
                            {project.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                    {/* Project Display */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selected Project
                        </label>
                        <div className="p-2 bg-gray-50 rounded-md">
                            {selectedProject.toUpperCase()}
                        </div>
                    </div>

                    {/* File List */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Files in {selectedProject}
                        </h3>
                        <div className="border rounded-md p-2 bg-gray-50 max-h-40 overflow-y-auto">
                            {files.length === 0 ? (
                                <p className="text-gray-500 text-sm">No files found</p>
                            ) : (
                                files.map(file => {
                                    const fullPath = path.join('scripts', selectedProject, file);
                                    return (
                                        <div
                                            key={file}
                                            className="p-1 hover:bg-gray-200 rounded cursor-pointer text-sm flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedFiles.includes(fullPath)}
                                                onChange={() => toggleFile(fullPath)}
                                                className="mr-2"
                                            />
                                            <span onClick={() => setFilename(file)}>
                                              📄 {file}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <button
                                type="button"
                                onClick={toggleAllFiles}
                                className="px-4 py-2 my-5 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                {isAllSelected ? 'Deselect All' : 'Select All'}
                            </button>
                            <button
                                type="button"
                                onClick={handleRunTests}
                                disabled={selectedFiles.length === 0}
                                className="px-4 py-2 my-5 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                            >
                                Run Selected Tests
                            </button>
                            <button
                                type="button"
                                onClick={handleShowReport}
                                className="px-4 py-2 my-5 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                            >
                                Show Report
                            </button>
                        </div>
                        {testResults && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                              <pre className="whitespace-pre-wrap text-sm">
                                {testResults}
                              </pre>
                            </div>
                        )}
                    </div>

                    {/* Main Form */}
                    <div className="max-w-md mx-auto">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Playwright Automation
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* URL Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Website URL
                                </label>
                                <div className="flex flex-col gap-2">
                                    <select
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select a saved URL</option>
                                        {urlPresets.map((preset) => (
                                            <option key={preset.url} value={preset.url}>
                                                {preset.name} ({preset.url})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="text-xs text-gray-500 text-center">or</div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Enter new URL"
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Save URL Section */}
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
                                    Output Filename (must end with .spec.js)
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
                        </form>

                        {message && (
                            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;