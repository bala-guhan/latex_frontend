import React, { useState } from 'react';
import './index.css';
import Chat from './components/chat';
import PdfUploader from './components/PdfUploader';

function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="w-full max-w-7xl h-[90vh] flex flex-row gap-8 items-center justify-center">
        {/* PDF Uploader - Left Side */}
        <div className="flex-shrink-0 flex items-center justify-center h-full">
          <div className="w-80 h-80 bg-black rounded-lg shadow-lg flex items-center justify-center">
            <PdfUploader setSessionId={setSessionId} />
          </div>
        </div>
        {/* Chat - Right Side */}
        <div className="flex-1 h-full bg-black rounded-lg shadow-lg flex items-center justify-center">
          <div className="w-full h-auto flex flex-col">
            <Chat sessionId={sessionId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;