import CreatorPageShell from '../components/CreatorPageShell'
import SectionCard from '../components/SectionCard'
import { Link } from 'react-router-dom'

export default function CreatorSettings() {
  return (
    <CreatorPageShell
      breadcrumbs={['Settings']}
      title="Settings"
      description="Manage your profile, account security, and data privacy."
    >
      <section className="settings-grid">
        <SectionCard title="Profile Settings">
          <p>Update your bio, name, and interests.</p>
          <Link to="/creator/settings/profile" className="inline-link">
            Open Profile Settings →
          </Link>
        </SectionCard>

        <SectionCard title="Account Security">
          <p>Change your password and manage 2FA.</p>
          <Link to="/creator/settings/account-security" className="inline-link">
            Open Account Security →
          </Link>
        </SectionCard>

        <SectionCard title="Data Privacy">
          <p>Control how your data is used.</p>
          <Link to="/creator/settings/data-privacy" className="inline-link">
            Open Data Privacy →
          </Link>
        </SectionCard>
      </section>
    </CreatorPageShell>
  )
}
