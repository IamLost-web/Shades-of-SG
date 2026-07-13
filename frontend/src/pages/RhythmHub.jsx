import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { getPublishedSongs } from '../services/publicSongService'
import { getBeatmapSummary } from '../services/beatmapService'

function difficultyLabel(difficulty) {
  return difficulty[0] + difficulty.slice(1).toLowerCase()
}

export default function RhythmHub() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getPublishedSongs()
      .then(async (data) => Promise.all(data.filter((song) => song.audioUrl && Number(song.durationSecs) >= 5).map(async (song) => {
        const beatmaps = await getBeatmapSummary(song.id).catch(() => [])
        return beatmaps
          .filter((row) => row.status === 'PUBLISHED')
          .map((row) => ({ ...song, beatmap: row.published, rhythmDifficulty: row.difficulty }))
      })))
      .then((data) => active && setTracks(data.flat()))
      .catch((nextError) => active && setError(nextError.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  return <div className="page-stack">
    <PageHeader description="Choose a difficulty track from a fully published song." eyebrow="Rhythm Game" title="Rhythm Game" />
    {loading ? <p role="status">Loading published rhythm games…</p> : null}
    {error ? <div className="state-box" role="alert">{error}</div> : null}
    {!loading && !error && tracks.length === 0 ? <EmptyState description="No fully published songs currently have a published rhythm track." title="No rhythm games yet" /> : null}
    <section className="responsive-grid">{tracks.map((track) => {
      const difficulty = difficultyLabel(track.rhythmDifficulty)
      return <SectionCard className="rhythm-track-card" key={`${track.id}:${track.rhythmDifficulty}`} title={`${track.title} — ${difficulty}`}>
        {track.coverImageUrl ? <img alt={`${track.title} cover`} className="song-art song-art--image" src={track.coverImageUrl} /> : <div className="song-art song-art--fallback">No cover</div>}
        <div className="rhythm-track-meta"><span className={`rhythm-track-badge is-${track.rhythmDifficulty.toLowerCase()}`}>{difficulty} track</span>{track.beatmap?.noteCount ? <small>{track.beatmap.noteCount} notes</small> : null}</div>
        <p>{track.artist || 'Artist unavailable'}</p>
        <p>{track.theme || 'Theme unavailable'} · {(track.languages || []).join(', ') || 'Language unavailable'}</p>
        <Link className="primary-link" to={`/game/${track.id}?difficulty=${track.rhythmDifficulty}`}>Play {difficulty} Track</Link>
      </SectionCard>
    })}</section>
  </div>
}
