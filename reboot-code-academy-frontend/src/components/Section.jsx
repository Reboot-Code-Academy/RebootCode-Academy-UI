function Section({ eyebrow, title, description, children, className = '' }) {
  return (
    <section className={`section ${className}`}>
      <div className="section-heading">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default Section
