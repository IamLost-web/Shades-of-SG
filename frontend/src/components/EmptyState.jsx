export default function EmptyState({ title = 'Nothing here yet', description = 'This area is ready for feature work.' }) {
  return (
    <div className="state-box">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
