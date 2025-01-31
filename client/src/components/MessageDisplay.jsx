function MessageDisplay({ message }) {
    if (!message) return null;
    const isError = message.toLowerCase().includes("failed") || message.toLowerCase().includes("error");
    return (
      <div className={`mt-4 p-3 ${isError ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'} rounded-md`}>
        {message}
      </div>
    );
  }
  
  export default MessageDisplay;
  