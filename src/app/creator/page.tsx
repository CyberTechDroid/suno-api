<div>
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-200 uppercase tracking-wide">
                    <span className="text-xl">🎸</span>
                    Music Style / Genre
                  </label>
                  <span className={`text-xs font-mono ${tags.length > 1000 ? 'text-red-400' : tags.length > 800 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {tags.length}/1000
                  </span>
                </div>
                <textarea
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  maxLength={1000}
                  placeholder="e.g., Indie Folk, Acoustic Rock, Upbeat, 120 BPM, Emotional, Storytelling, Guitar-driven, Melodic, Summer vibes, Road trip anthem"
                  className="w-full p-4 rounded-xl bg-gray-900/50 border-2 border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-500 text-lg shadow-inner font-normal min-h-[120px] resize-none"
                  rows={3}
                />
                <p className="mt-2 text-xs text-gray-500">Keep it concise - describe the genre, mood, and key characteristics</p>
              </div>