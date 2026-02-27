
import React from 'react';
import Header from './components/Header';
import VideoProcessor from './components/VideoProcessor';

const App: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen selection:bg-white/30">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <VideoProcessor />
      </main>
    </div>
  );
};

export default App;
