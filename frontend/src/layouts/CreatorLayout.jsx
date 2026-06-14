import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function CreatorLayout() {
  return (
    <div className="creator-shell">
      <Sidebar />
      <div className="creator-workspace">
        <Navbar role="creator" variant="creator" />
        <main className="creator-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
