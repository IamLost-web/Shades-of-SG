import CreatorAccountWidget from '../CreatorAccountWidget'

export default function StudioHeader({ onMenuToggle, showMenuButton = false }) {
  return (
    <header className="studio-header">
      <div className="studio-header__copy">
        <div className="studio-breadcrumbs" aria-label="Breadcrumb">
          <span>Creator Portal</span>
          <span>Studio</span>
          <span>Edit Song</span>
        </div>
        <div className="studio-header__title-row">
          {showMenuButton && (
            <button aria-label="Open Studio navigation" className="studio-header__menu-button" onClick={onMenuToggle} type="button">
              Menu
            </button>
          )}
          <div>
            <h1>Studio</h1>
            <p>Create and curate your song details. Save as draft or generate your AI music video.</p>
          </div>
        </div>
      </div>

      <div className="studio-header__actions">
        <CreatorAccountWidget />
        <div className="studio-header__button-row">
          <button className="studio-button studio-button--secondary" type="button">
            Preview Song Experience
          </button>
          <button className="studio-button studio-button--secondary" type="button">
            Generate Video
          </button>
          <button className="studio-button studio-button--primary" type="button">
            Save Draft
          </button>
        </div>
      </div>
    </header>
  )
}
