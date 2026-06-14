export default function LoadingState({ label = 'Loading content' }) {
  return (
    <div className="state-box loading-state" role="status">
      <span />
      <p>{label}</p>
    </div>
  )
}
