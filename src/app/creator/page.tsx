'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Song {
  id: string;
  title: string;
  image_url: string;
  lyric: string;
  audio_url: string;
  video_url: string;
  created_at: string;
  model_name: string;
  status: string;
  prompt: string;
  tags: string;
  duration?: number;
  gpt_description_prompt?: string;
}

export default function SongCreator() {
  const [prompt, setPrompt] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [makeInstrumental, setMakeInstrumental] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState<Song[]>([]);
  const [error, setError] = useState('');
  const [mySongs, setMySongs] = useState<Song[]>([]);
  const [showMySongs, setShowMySongs] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  const generateSong = async () => {
    if (!prompt.trim() && !customMode) {
      setError('Please enter a prompt or description');
      return;
    }

    if (customMode && !lyrics.trim() && !prompt.trim()) {
      setError('Please enter lyrics or a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedSongs([]);

    try {
      const endpoint = customMode ? '/api/custom_generate' : '/api/generate';
      const body = customMode
        ? {
            prompt: lyrics || prompt,
            tags: tags || prompt,
            title: title || 'Untitled',
            make_instrumental: makeInstrumental,
            wait_audio: false,
          }
        : {
            prompt,
            make_instrumental: makeInstrumental,
            wait_audio: false,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate song: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedSongs(Array.isArray(data) ? data : [data]);
      
      // Poll for updates
      if (data && data.length > 0) {
        pollForUpdates(data.map((s: Song) => s.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate song');
    } finally {
      setLoading(false);
    }
  };

  const pollForUpdates = async (songIds: string[]) => {
    const maxAttempts = 60; // 5 minutes
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/get?ids=${songIds.join(',')}`);
        const songs = await response.json();
        
        setGeneratedSongs(songs);

        const allComplete = songs.every((s: Song) => s.status === 'complete' || s.status === 'error');
        
        if (!allComplete && attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 5000); // Check every 5 seconds
        }
      } catch (err) {
        console.error('Error checking song status:', err);
      }
    };

    setTimeout(checkStatus, 5000);
  };

  const fetchMySongs = async () => {
    setLoadingSongs(true);
    setError('');
    
    try {
      const response = await fetch('/api/get');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      setMySongs(Array.isArray(data) ? data : []);
      setShowMySongs(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch songs');
    } finally {
      setLoadingSongs(false);
    }
  };

  const generateLyrics = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate lyrics');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate_lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate lyrics');
      }

      const data = await response.json();
      setLyrics(data.text || data.lyrics || '');
      setCustomMode(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lyrics');
    } finally {
      setLoading(false);
    }
  };

  const downloadSong = async (song: Song) => {
    if (!song.audio_url) return;
    
    try {
      const response = await fetch(song.audio_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.title || 'song'}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: open in new tab
      window.open(song.audio_url, '_blank');
    }
  };

  const SongCard = ({ song }: { song: Song }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700/50">
      {song.image_url && (
        <div className="relative overflow-hidden">
          <Image 
            src={song.image_url} 
            alt={song.title || 'Song cover'} 
            width={400}
            height={224}
            className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
        </div>
      )}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {song.title || song.gpt_description_prompt || 'Generating...'}
          </h3>
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              song.status === 'complete' ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50' : 
              song.status === 'streaming' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50 animate-pulse' : 
              song.status === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/50' : 
              'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/50 animate-pulse'
            }`}>
              {song.status === 'complete' ? '✓' : song.status === 'streaming' ? '⏳' : song.status === 'error' ? '✗' : '⚡'}
              {song.status}
            </span>
          </div>
        </div>
        
        {song.tags && (
          <div className="flex flex-wrap gap-2">
            {song.tags.split(',').slice(0, 3).map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-xs text-purple-200">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        
        {song.audio_url && (
          <div className="space-y-3">
            <audio controls className="w-full rounded-lg bg-gray-900/50 shadow-inner">
              <source src={song.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={() => downloadSong(song)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-3 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download MP3
            </button>
          </div>
        )}
        
        {song.lyric && (
          <details className="group">
            <summary className="cursor-pointer font-semibold text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 border border-gray-700/50">
              <svg className="w-5 h-5 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              View Lyrics
            </summary>
            <pre className="whitespace-pre-wrap mt-3 text-sm bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto text-gray-300 leading-relaxed shadow-inner border border-gray-800 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
              {song.lyric}
            </pre>
          </details>
        )}
        
        {song.duration && (
          <div className="flex items-center gap-2 text-gray-400 text-sm pt-2 border-t border-gray-700/50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duration: {Math.floor(song.duration)}s
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-12 space-y-4">
          <div className="inline-block animate-bounce mb-4">
            <div className="text-7xl filter drop-shadow-2xl">🎵</div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 animate-gradient drop-shadow-2xl">
            STOF - AI Song Creator
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Create amazing music with artificial intelligence ✨
          </p>
          <div className="flex gap-3 justify-center items-center text-sm text-gray-300 pt-2">
            <span className="flex items-center gap-1 px-3 py-1 bg-purple-600/30 rounded-full border border-purple-500/50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fast Generation
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-pink-600/30 rounded-full border border-pink-500/50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              High Quality
            </span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-10 mb-12">
          <div className="grid grid-cols-2 gap-4 mb-8 p-1 bg-gray-900/50 rounded-xl">
            <button
              onClick={() => setCustomMode(false)}
              className={`py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                !customMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-105 text-white'
                  : 'bg-transparent hover:bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl">✨</span>
              <span>Simple Mode</span>
            </button>
            <button
              onClick={() => setCustomMode(true)}
              className={`py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                customMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-105 text-white'
                  : 'bg-transparent hover:bg-gray-800/50 text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-xl">🎨</span>
              <span>Custom Mode</span>
            </button>
          </div>

          {!customMode ? (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-200 uppercase tracking-wide">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Describe your song
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A cheerful pop song about summer adventures, with upbeat rhythm and catchy chorus"
                  className="w-full p-5 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-500 text-lg shadow-inner"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                <input
                  type="checkbox"
                  id="instrumental"
                  checked={makeInstrumental}
                  onChange={(e) => setMakeInstrumental(e.target.checked)}
                  className="w-6 h-6 accent-purple-600 cursor-pointer"
                />
                <label htmlFor="instrumental" className="text-base text-gray-200 cursor-pointer flex items-center gap-2 select-none">
                  <span className="text-xl">🎹</span>
                  Make it instrumental (no lyrics)
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-200 uppercase tracking-wide">
                  <span className="text-xl">📝</span>
                  Song Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Amazing Song"
                  className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-500 text-lg shadow-inner"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-200 uppercase tracking-wide">
                  <span className="text-xl">🎸</span>
                  Music Style / Genre
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., Indie Folk, Acoustic Rock, Upbeat, 120 BPM"
                  className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-500 text-lg shadow-inner"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-200 uppercase tracking-wide">
                    <span className="text-xl">✍️</span>
                    Lyrics
                  </label>
                  <button
                    onClick={generateLyrics}
                    disabled={loading || !prompt.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 px-5 py-2.5 rounded-xl font-bold transition-all disabled:cursor-not-allowed shadow-lg disabled:shadow-none text-sm"
                  >
                    <span className="text-base">🪄</span>
                    Auto-Generate
                  </button>
                </div>
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="[Verse 1]&#10;Your lyrics here...&#10;&#10;[Chorus]&#10;More lyrics...&#10;&#10;[Verse 2]&#10;Continue your story..."
                  className="w-full p-5 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none font-mono transition-all text-white placeholder-gray-500 shadow-inner"
                  rows={10}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-200 uppercase tracking-wide">
                  <span className="text-xl">💭</span>
                  Or describe what you want (for lyrics generation)
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A song about overcoming challenges and finding inner strength"
                  className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-500 text-lg shadow-inner"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                <input
                  type="checkbox"
                  id="instrumental-custom"
                  checked={makeInstrumental}
                  onChange={(e) => setMakeInstrumental(e.target.checked)}
                  className="w-6 h-6 accent-purple-600 cursor-pointer"
                />
                <label htmlFor="instrumental-custom" className="text-base text-gray-200 cursor-pointer flex items-center gap-2 select-none">
                  <span className="text-xl">🎹</span>
                  Make it instrumental (no lyrics)
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-5 bg-gradient-to-r from-red-600/90 to-rose-600/90 rounded-xl border-2 border-red-500 shadow-lg shadow-red-500/30 animate-shake">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={generateSong}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 py-5 px-8 rounded-xl font-black text-xl transition-all shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span className="text-2xl">🎵</span>
                  Create Song
                </>
              )}
            </button>
            <button
              onClick={fetchMySongs}
              disabled={loadingSongs}
              className="sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 py-5 px-8 rounded-xl font-black text-xl transition-all shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3"
            >
              {loadingSongs ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <span className="text-2xl">📚</span>
                  My Songs
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl border border-yellow-500/30">
            <p className="text-center text-gray-200 text-sm flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-semibold">Tip:</span> Each song generation uses 10 credits and creates 2 variations
            </p>
          </div>
        </div>

        {generatedSongs.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🎼 Generated Songs
              </h2>
              <p className="text-gray-300">Your AI-created masterpieces are ready!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {generatedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}

        {showMySongs && mySongs.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 p-6 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700/50">
              <div>
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  🎵 My Song Library
                </h2>
                <p className="text-gray-300 mt-2">{mySongs.length} {mySongs.length === 1 ? 'song' : 'songs'} in your collection</p>
              </div>
              <button
                onClick={() => setShowMySongs(false)}
                className="w-12 h-12 flex items-center justify-center bg-gray-700 hover:bg-red-600 rounded-xl transition-all transform hover:scale-110 active:scale-95"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}

        {showMySongs && mySongs.length === 0 && !loadingSongs && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6 opacity-50">🎵</div>
            <p className="text-2xl text-gray-300 font-semibold mb-2">No songs found</p>
            <p className="text-gray-400">Create your first song above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
