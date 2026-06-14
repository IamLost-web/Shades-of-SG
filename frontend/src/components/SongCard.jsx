import { Link } from 'react-router-dom'

export default function SongCard({ song }) {
  return (
    <article className="song-card">
      <div className="song-art" aria-hidden="true">
        {song.initials}
      </div>
      <div>
        <p className="eyebrow">{song.theme}</p>
        <h3>{song.title}</h3>
        <p>{song.description}</p>
      </div>
      <Link to={`/songs/${song.id}`}>Explore Song</Link>
    </article>
  )
}
