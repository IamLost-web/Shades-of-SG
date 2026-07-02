export default function StudioFooter() {
  return (
    <footer className="studio-footer">
      <p className="studio-footer__status">Auto-saved a few seconds ago</p>
      <div className="studio-footer__actions">
        <button className="studio-button studio-button--secondary" type="button">
          Cancel
        </button>
        <button className="studio-button studio-button--secondary" type="button">
          Save Draft
        </button>
        <button className="studio-button studio-button--primary" type="button">
          Next: Lyrics
        </button>
      </div>
    </footer>
  )
}