export default function FilterBar({ filters = ['Era', 'Theme', 'Language', 'Instrument'] }) {
  return (
    <form className="filter-bar">
      <label>
        <span>Search</span>
        <input placeholder="Search songs, stories, or instruments" type="search" />
      </label>
      {filters.map((filter) => (
        <label key={filter}>
          <span>{filter}</span>
          <select defaultValue="">
            <option value="">All</option>
            <option value="placeholder">Placeholder</option>
          </select>
        </label>
      ))}
    </form>
  )
}
