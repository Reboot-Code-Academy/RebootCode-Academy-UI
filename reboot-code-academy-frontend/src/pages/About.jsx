import Section from '../components/Section.jsx'

function About() {
  return (
    <div className="page">
      <section className="page-hero compact-hero">
        <span className="eyebrow">About Us</span>
        <h1>Training that connects fundamentals with real project work.</h1>
        <p>
          Reboot Code Academy is built for students who want clear guidance,
          practical coding habits, and confidence to build software step by step.
        </p>
      </section>

      <Section
        description="Our teaching style is simple: explain the concept, build with it, review the result, then improve it."
        eyebrow="Learning Model"
        title="How we teach"
      >
        <div className="process-grid">
          {['Understand', 'Practice', 'Build', 'Review'].map((item, index) => (
            <article className="process-card" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item}</h3>
              <p>
                {item === 'Understand'
                  ? 'Start with the why behind each programming idea.'
                  : null}
                {item === 'Practice'
                  ? 'Solve small exercises until the concept feels familiar.'
                  : null}
                {item === 'Build'
                  ? 'Apply the skill inside real website and app features.'
                  : null}
                {item === 'Review'
                  ? 'Get feedback and learn how to make the code cleaner.'
                  : null}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default About
