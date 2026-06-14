import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <h2>Shades of SG</h2>
        <p>Music, memory, and interactive cultural learning for Singapore stories.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <Link to="/songs">Songs</Link>
        <Link to="/learning">Learning Hub</Link>
        <Link to="/rhythm-game">Rhythm Game</Link>
      </div>
      <div>
        <h3>Social</h3>
        <span>Instagram</span>
        <span>TikTok</span>
        <span>YouTube</span>
      </div>
      <p className="footer-copy">Copyright 2026 Shades of SG. All rights reserved.</p>
    </footer>
  )
}
