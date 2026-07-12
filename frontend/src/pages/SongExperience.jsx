import React, { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Play, Pause } from 'lucide-react'

// MOCK DATA: Populated from our Phase 1 Generation (mockJobData.json) and extended with Trivia & Instruments
const MOCK_SONG_DATA = {
  title: "Tomorrow's Here Today",
  artist: "53A",
  videoUrl: "https://res.cloudinary.com/dep1fjics/video/upload/v1783766931/shades-of-sg/audio/ps0fkqa3vb0nvz4jmrrn.mp4",
  culturalSummary: "Released as the theme song for Singapore's National Day Parade in 2016, 'Tomorrow's Here Today' embodies an upbeat, forward-looking spirit. Written by Don Richmond and performed by local indie pop band 53A, the song represents a modern, energetic, and optimistic vision of Singapore's future, encouraging unity and celebrating the diverse voices that make up the nation's fabric.",
  instruments: [
    { name: "Acoustic Guitar", role: "Provides the bright, driving rhythmic foundation of the track." },
    { name: "Electric Bass", role: "Adds a warm, upbeat groove that keeps the song moving forward." },
    { name: "Drum Kit", role: "Delivers an energetic pop-rock beat with anthemic cymbal crashes." },
    { name: "Synthesizer", role: "Creates the modern, uplifting atmospheric layers in the background." }
  ],
  trivia: [
    {
      question: "Which band performed the 2016 NDP theme song 'Tomorrow's Here Today'?",
      options: ["The Sam Willows", "53A", "Electrico", "ShiGGa Shay"],
      answer: "53A"
    },
    {
      question: "Who wrote and composed the song?",
      options: ["Dick Lee", "Don Richmond", "JJ Lin", "Corrinne May"],
      answer: "Don Richmond"
    },
    {
      question: "What is the core message of the song?",
      options: ["Reflecting on past struggles", "Looking forward to a bright future", "A romantic love story", "Celebrating traditional food"],
      answer: "Looking forward to a bright future"
    },
    {
      question: "Which music genre best describes the track?",
      options: ["Classical Orchestra", "Indie Pop/Rock", "Heavy Metal", "Electronic Dance Music"],
      answer: "Indie Pop/Rock"
    },
    {
      question: "What year was this song used for the National Day Parade?",
      options: ["2014", "2015", "2016", "2017"],
      answer: "2016"
    }
  ],
  lyrics: [
    { startTime: 0, endTime: 6, text: "Raise your head to the skies" },
    { startTime: 6, endTime: 11, text: "This is how we all begin" },
    { startTime: 11, endTime: 16, text: "See the fire in your eyes" },
    { startTime: 16, endTime: 21, text: "Feel the yearning deep within" },
    { startTime: 21, endTime: 26, text: "Take a leap and you will fly" }
  ]
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export default function SongExperience() {
  const { id = 'demo-song' } = useParams()
  
  // Video Player State
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  // Synchronized Subtitles
  const activeLyric = MOCK_SONG_DATA.lyrics.find(
    (line) => currentTime >= line.startTime && currentTime <= line.endTime
  )

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 p-6 md:p-8 lg:p-12 font-sans">
      
      {/* Header section */}
      <header className="mb-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-emerald-400 font-semibold tracking-wide uppercase text-sm mb-1">Song Experience</p>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            {MOCK_SONG_DATA.title}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">by {MOCK_SONG_DATA.artist}</p>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top-Left: Video Player (Spans 2 columns on large screens) */}
        <section className="lg:col-span-2 bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-3"></span>
            Official Music Video
          </h2>
          <div className="flex-grow bg-[#0F172A] rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-inner relative">
            
            {/* Video Element */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video 
                ref={videoRef}
                src={MOCK_SONG_DATA.videoUrl}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
              />
              
              {/* Synchronized Subtitles Overlay */}
              {activeLyric && (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center px-8 pointer-events-none transition-opacity duration-300">
                  <div className="bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xl md:text-2xl lg:text-3xl font-semibold py-3 px-6 rounded-xl text-center shadow-2xl drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    {activeLyric.text}
                  </div>
                </div>
              )}
            </div>
            
            {/* Custom Controls Bar */}
            <div className="bg-[#1E293B]/80 backdrop-blur text-xs p-4 text-slate-300 border-t border-slate-800 flex flex-col gap-3 z-10">
              
              {/* Scrubber */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-grow h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors"
                />
                <span className="font-mono text-slate-400 w-10">{formatTime(duration)}</span>
              </div>
              
              {/* Play/Pause & Actions */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 flex items-center justify-center transition-colors border border-blue-500/30"
                >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                </button>
              </div>
              
            </div>
          </div>
        </section>

        {/* Top-Right: Instruments Placeholder */}
        <section className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3"></span>
            Instruments
          </h2>
          <div className="flex-grow flex flex-col gap-3 overflow-y-auto">
            {MOCK_SONG_DATA.instruments.map((inst, i) => (
              <div key={i} className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-colors shadow-sm">
                <h3 className="font-medium text-emerald-400 mb-1.5 flex items-center justify-between">
                  {inst.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{inst.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom-Left: Summary Placeholder (Spans 2 columns on large screens) */}
        <section className="lg:col-span-2 bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-3"></span>
            Cultural Significance
          </h2>
          <div className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl p-5 md:p-6 shadow-inner flex-grow">
            <p className="text-slate-300 leading-relaxed text-lg">
              {MOCK_SONG_DATA.culturalSummary}
            </p>
          </div>
        </section>

        {/* Bottom-Right: Trivia Placeholder */}
        <section className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6 shadow-2xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-3"></span>
            Trivia Challenge
          </h2>
          <div className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl p-5 flex flex-col gap-4 shadow-inner flex-grow justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Question 1 of 5</span>
                <span className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                  ))}
                </span>
              </div>
              <p className="text-slate-200 font-medium leading-snug">{MOCK_SONG_DATA.trivia[0].question}</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5 mt-2">
              {MOCK_SONG_DATA.trivia[0].options.map((opt, i) => (
                <button key={i} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm py-3 px-4 rounded-lg text-left transition-colors border border-slate-700 hover:border-amber-500/50 shadow-sm">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Full-width Bottom: Learning Hub CTA */}
        <section className="lg:col-span-3 mt-2">
          <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-indigo-500/30 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
            
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-400/30 transition-all duration-500"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all duration-500"></div>
            
            <div className="relative z-10 mb-6 md:mb-0 md:mr-8 text-center md:text-left flex-grow">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to master this song?</h2>
              <p className="text-indigo-200 text-lg max-w-2xl">Dive into the Learning Hub to practice rhythm, pitch, and lyrics interactively with our gamified modules.</p>
            </div>
            
            <Link to={`/songs/${id}/playground`} className="relative z-10 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all transform hover:-translate-y-1 w-full md:w-auto text-lg whitespace-nowrap text-center">
              Enter Learning Hub
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
