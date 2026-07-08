import PlaceholderPage from './PlaceholderPage'

export default function TriviaHub() {
  return <PlaceholderPage title="Trivia" description="Song-based trivia challenges will appear here." />
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'

/*
TODO - Htet

Implement question fetching.
Implement answer validation.
Implement score and results display.
*/
export default function TriviaHub() {
  return (
    <div className="page-stack">
      <PageHeader
        description="Trivia shell for song-specific questions, progress, and results."
        eyebrow="Trivia"
        title="Song Trivia"
      />
      <section className="three-column">
        <SectionCard title="Question Area">
          <p>Question text, answers, hints, and feedback will appear here.</p>
        </SectionCard>
        <SectionCard title="Progress Tracker">
          <div className="progress-track"><span style={{ width: '35%' }} /></div>
          <p>Placeholder progress: 2 of 6 questions.</p>
        </SectionCard>
        <SectionCard title="Results Area">
          <p>Score summary, badges, and next activity links will be shown after completion.</p>
        </SectionCard>
      </section>
    </div>
  )
}
