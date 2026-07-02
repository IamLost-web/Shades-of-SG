const steps = [
  { id: 'metadata', label: 'Metadata', description: 'Song details' },
  { id: 'lyrics', label: 'Lyrics', description: 'Write and organize' },
  { id: 'publish', label: 'Preview & Publish', description: 'Review and publish' },
]

export default function MetadataStepper({ activeStep = 1 }) {
  return (
    <section className="studio-stepper" aria-label="Studio progress">
      {steps.map((step, index) => {
        const isActive = index + 1 === activeStep
        const isComplete = index + 1 < activeStep

        return (
          <div className={`studio-stepper__item ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`} key={step.id}>
            <div className="studio-stepper__number">{index + 1}</div>
            <div className="studio-stepper__text">
              <strong>{step.label}</strong>
              <span>{step.description}</span>
            </div>
          </div>
        )
      })}
    </section>
  )
}