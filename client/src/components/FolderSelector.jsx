import { useEffect } from 'react';

function FolderSelector({ selectedFolder, setSelectedFolder, existingFolders, newFolder, setNewFolder }) {
  useEffect(() => {
    if (selectedFolder !== 'new') {
      setNewFolder('');
    }
  }, [selectedFolder, setNewFolder]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Folder</label>
      <div className="flex flex-col gap-2">
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an existing folder</option>
          {existingFolders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
          <option value="new">-- Create New Folder --</option>
        </select>
        {selectedFolder === 'new' && (
          <input
            type="text"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            placeholder="Enter new folder name"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>
    </div>
  );
}

export default FolderSelector;
