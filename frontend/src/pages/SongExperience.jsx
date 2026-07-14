import { useEffect, useRef, useState } from 'react'
import { Maximize2, Pause, Play, Volume2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { getBeatmapSummary } from '../services/beatmapService'
import { getPublishedSong } from '../services/publicSongService'
import './SongExperience.css'

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  return `${minutes}:${String(Math.floor(value % 60)).padStart(2, '0')}`
}

function difficultyLabel(difficulty) {
  return difficulty[0] + difficulty.slice(1).toLowerCase()
}

export default function SongExperience() {
  const { id } = useParams()
  const videoRef = useRef(null)
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rhythmDifficulties, setRhythmDifficulties] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    let active = true
    Promise.all([getPublishedSong(id), getBeatmapSummary(id).catch(() => [])])
      .then(([data, beatmaps]) => {
        if (!active) return
        setSong(data)
        setRhythmDifficulties(beatmaps.filter((beatmap) => beatmap.status === 'PUBLISHED').map((beatmap) => beatmap.difficulty))
      })
      .catch((nextError) => active && setError(nextError.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume
  }, [song?.videoUrl, volume])

  async function togglePlayback() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try { await video.play() } catch { setIsPlaying(false) }
    } else {
      video.pause()
    }
  }

  function seek(event) {
    const nextTime = Number(event.target.value)
    if (!videoRef.current || !Number.isFinite(nextTime)) return
    videoRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  function changePlaybackRate(event) {
    const nextRate = Number(event.target.value)
    setPlaybackRate(nextRate)
    if (videoRef.current) videoRef.current.playbackRate = nextRate
  }

  if (loading) return <div className="page-stack"><p role="status">Loading published song…</p></div>
  if (error || !song) return <div className="page-stack"><div className="state-box" role="alert">{error || 'Published song not found.'}</div><Link to="/songs">Back to Songs</Link></div>

  const metadata = [song.artist, song.theme, ...(song.languages || [])].filter(Boolean)

  return <div className="page-stack song-experience-page">
    <PageHeader description={metadata.join(' · ') || 'Published music from Shades of SG'} eyebrow="Song Experience" title={song.title} />

    <div className="song-experience-layout">
      <div className="se-left-col">
        <section aria-label="Song video" className="section-card song-player-card">
          {song.videoUrl ? <>
            <video
              className="song-player-video"
              onEnded={() => { setIsPlaying(false); setCurrentTime(0) }}
              onLoadedMetadata={(event) => { setDuration(event.currentTarget.duration); setCurrentTime(0) }}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              playsInline
              poster={song.coverImageUrl || undefined}
              ref={videoRef}
              src={song.videoUrl}
            />
            <div aria-label="Video controls" className="song-player-controls">
              <button aria-label={isPlaying ? 'Pause song video' : 'Play song video'} onClick={togglePlayback} type="button">
                {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <input aria-label="Video progress" max={duration || 0} min="0" onChange={seek} step="0.1" type="range" value={currentTime} />
              <label className="song-player-volume"><Volume2 aria-hidden="true" /><span className="sr-only">Volume</span><input aria-label="Video volume" max="1" min="0" onChange={(event) => setVolume(Number(event.target.value))} step="0.05" type="range" value={volume} /></label>
              <label className="song-player-speed"><span className="sr-only">Playback speed</span><select aria-label="Playback speed" onChange={changePlaybackRate} value={playbackRate}><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
              <button aria-label="Enter video fullscreen" onClick={() => videoRef.current?.requestFullscreen?.()} type="button"><Maximize2 aria-hidden="true" /></button>
            </div>
          </> : song.coverImageUrl
            ? <img alt={`${song.title} cover artwork`} className="song-player-video song-player-cover" src={song.coverImageUrl} />
            : <div className="song-player-unavailable">Video and cover media are unavailable.</div>}
        </section>

        <section className="section-card song-about-card">
          <p className="eyebrow">Cultural Summary</p>
          <h2>About this song</h2>
          <p>{song.description || 'A cultural summary is not available for this song.'}</p>
        </section>
      </div>

      <aside className="se-right-col">
        <section className="section-card song-detail-card">
          <p className="eyebrow">Song Details</p>
          <h2>At a glance</h2>
          <dl className="detail-list">
            <div><dt>Artist</dt><dd>{song.artist || 'Unavailable'}</dd></div>
            <div><dt>Theme</dt><dd>{song.theme || 'Unavailable'}</dd></div>
            <div><dt>Languages</dt><dd>{(song.languages || []).join(', ') || 'Unavailable'}</dd></div>
          </dl>
          <div className="song-experience-tags">{(song.moodTags || []).map((mood) => <span key={mood}>{mood}</span>)}</div>
        </section>

        <section className="section-card song-activities-card">
          <p className="eyebrow">Explore & Learn</p>
          <h2>Continue the experience</h2>
          <div className="song-activity-links">
            <Link to={`/songs/${id}/playground`}>Open Playground</Link>
            <Link to={`/songs/${id}/trivia`}>Start Trivia</Link>
            {rhythmDifficulties.length ? rhythmDifficulties.map((difficulty) => <Link key={difficulty} to={`/game/${id}?difficulty=${difficulty}`}>Play {difficultyLabel(difficulty)} Rhythm</Link>) : <span className="is-disabled" title="This rhythm game is not available yet.">Rhythm game unavailable</span>}
            <Link to={`/reflections?song_id=${encodeURIComponent(id)}`}>Share a Reflection</Link>
            <Link to="/learning">Visit Learning Hub</Link>
          </div>
        </section>
      </aside>
    </div>
  </div>
}
