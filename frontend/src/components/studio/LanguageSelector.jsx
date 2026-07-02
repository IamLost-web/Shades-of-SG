const defaultLanguages = ['English', 'Chinese', 'Malay', 'Tamil', 'Others']

export default function LanguageSelector({ selectedLanguages, otherLanguage, onOtherLanguageChange, onToggleLanguage }) {
  return (
    <section className="studio-languages">
      <div className="studio-card__section-heading">
        <h3>
          Languages Used <span aria-hidden="true">ⓘ</span>
        </h3>
      </div>

      <div className="studio-languages__grid">
        {defaultLanguages.slice(0, 4).map((language) => {
          const checked = selectedLanguages.includes(language)

          return (
            <label className={`studio-option-chip ${checked ? 'is-selected' : ''}`} key={language}>
              <input checked={checked} onChange={() => onToggleLanguage(language)} type="checkbox" />
              <span>{language}</span>
            </label>
          )
        })}
      </div>

      <div className="studio-language-other-row">
        <label className={`studio-option-chip ${selectedLanguages.includes('Others') ? 'is-selected' : ''}`}>
          <input checked={selectedLanguages.includes('Others')} onChange={() => onToggleLanguage('Others')} type="checkbox" />
          <span>Others</span>
        </label>
        <label className="studio-field studio-other-language">
        <input onChange={(event) => onOtherLanguageChange(event.target.value)} placeholder="Specify language" value={otherLanguage} />
      </label>
      </div>
    </section>
  )
}
