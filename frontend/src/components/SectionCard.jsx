export default function SectionCard({ title, description, children, className = '' }) {
  return (
    <section className={`section-card ${className}`}>
      {(title || description) && (
        <header>
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
