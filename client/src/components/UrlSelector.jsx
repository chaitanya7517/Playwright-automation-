// client/src/components/UrlSelector.jsx
const UrlSelector = ({ url, setUrl, urlPresets }) => {
    return (
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
    );
  };
  
  export default UrlSelector;
  