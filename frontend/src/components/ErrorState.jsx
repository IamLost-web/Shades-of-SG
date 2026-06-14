export default function ErrorState({ title = 'Something went wrong', description = 'Retry controls can be wired here later.' }) {
  return (
    <div className="state-box error-state" role="alert">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
