'use client';

import { useState } from 'react';

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

  const generateSong = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt or description');
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

  const SongCard = ({ song }: { song: Song }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {song.image_url && (
        <img src={song.image_url} alt={song.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">
          {song.title || 'Generating...'}
        </h3>
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
            song.status === 'complete' ? 'bg-green-600' : 
            song.status === 'streaming' ? 'bg-blue-600' : 
            song.status === 'error' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            {song.status}
          </span>
        </div>
        {song.tags && (
          <p className="text-gray-400 text-sm mb-2">{song.tags}</p>
        )}
        {song.audio_url && (
          <audio controls className="w-full mb-3">
            <source src={song.audio_url} type="audio/mpeg" />
          </audio>
        )}
        {song.lyric && (
          <details className="text-gray-300 text-sm mb-2">
            <summary className="cursor-pointer font-semibold mb-1">Lyrics</summary>
            <pre className="whitespace-pre-wrap mt-2 text-xs">{song.lyric}</pre>
          </details>
        )}
        {song.duration && (
          <p className="text-gray-400 text-sm">
            Duration: {Math.floor(song.duration)}s
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            🎵 STOF - AI Song Creator
          </h1>
          <p className="text-xl text-gray-300">Create amazing music with AI</p>
        </header>

        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCustomMode(false)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                !customMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Simple Mode
            </button>
            <button
              onClick={() => setCustomMode(true)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                customMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Custom Mode
            </button>
          </div>

          {!customMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Describe your song:
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A cheerful pop song about summer adventures"
                  className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="instrumental"
                  checked={makeInstrumental}
                  onChange={(e) => setMakeInstrumental(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="instrumental" className="text-sm">
                  Make it instrumental (no lyrics)
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Amazing Song"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Music Style / Tags:
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., Indie Folk, Acoustic Rock, Upbeat"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold">Lyrics:</label>
                  <button
                    onClick={generateLyrics}
                    disabled={loading}
                    className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    Generate Lyrics from Prompt
                  </button>
                </div>
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="[Verse 1]&#10;Your lyrics here...&#10;&#10;[Chorus]&#10;More lyrics..."
                  className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                  rows={8}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Or describe what you want (for lyrics generation):
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A song about overcoming challenges"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="instrumental-custom"
                  checked={makeInstrumental}
                  onChange={(e) => setMakeInstrumental(e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="instrumental-custom" className="text-sm">
                  Make it instrumental (no lyrics)
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-600 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={generateSong}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 py-4 px-8 rounded-lg font-bold text-lg transition shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : '🎵 Create Song'}
            </button>
            <button
              onClick={fetchMySongs}
              disabled={loadingSongs}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 py-4 px-8 rounded-lg font-bold text-lg transition shadow-lg disabled:cursor-not-allowed"
            >
              {loadingSongs ? 'Loading...' : '📚 My Songs'}
            </button>
          </div>
        </div>

        {generatedSongs.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Generated Songs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}

        {showMySongs && mySongs.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">My Songs</h2>
              <button
                onClick={() => setShowMySongs(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
