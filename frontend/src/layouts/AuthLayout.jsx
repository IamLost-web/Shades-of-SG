import { Link, Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-card" aria-label="Authentication">
        <Link className="brand-mark auth-brand" to="/">
          <span>SG</span>
          <strong>Shades of SG</strong>
        </Link>
        <Outlet />
      </section>
    </main>
  )
}
