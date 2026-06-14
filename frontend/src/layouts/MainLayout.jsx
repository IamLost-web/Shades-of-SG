import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export default function MainLayout({ role = 'guest' }) {
  return (
    <div className="app-shell public-shell">
      <Navbar role={role} />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
