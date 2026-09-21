import Section from '../components/Section.jsx'

const learningModel = [
  {
    number: '01',
    title: 'Understand',
    text: 'Start with the why behind each programming idea.',
    icon: '?',
  },
  {
    number: '02',
    title: 'Practice',
    text: 'Solve small exercises until the concept feels familiar.',
    icon: '</>',
  },
  {
    number: '03',
    title: 'Build',
    text: 'Apply the skill inside real website and app features.',
    icon: '◆',
  },
  {
    number: '04',
    title: 'Review',
    text: 'Get feedback and learn how to make the code cleaner.',
    icon: '↗',
  },
]

const academyValues = [
  {
    title: 'Practical Learning',
    text: 'Focus on understanding concepts and applying them through coding exercises and projects.',
    icon: '</>',
  },
  {
    title: 'Clear Guidance',
    text: 'Follow a structured learning path so each new topic builds on what you already know.',
    icon: '→',
  },
  {
    title: 'Project Mindset',
    text: 'Move beyond isolated examples and use your skills to create useful software features.',
    icon: '◆',
  },
  {
    title: 'Continuous Improvement',
    text: 'Review your work, identify gaps, and keep improving your technical skills step by step.',
    icon: '↗',
  },
]

const learnerFit = [
  'Students starting their programming journey',
  'Learners looking for practical software development skills',
  'Students who want to strengthen coding fundamentals',
  'Learners who want project-based practice',
]

function About({ onNavigate }) {
  return (
    <div className="page reboot-about-page">
      <section className="page-hero compact-hero reboot-about-hero">
        <div className="about-hero-content">
          <span className="eyebrow">About Us</span>
          <h1>Training that connects fundamentals with real project work.</h1>
          <p>
            Reboot Code Academy is built for students who want clear guidance,
            practical coding habits, and confidence to build software step by step.
          </p>

          <div className="about-hero-actions">
            <button type="button" onClick={() => onNavigate('/courses')}>
              Explore Courses
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate('/contact')}
            >
              Book a Demo
            </button>
          </div>
        </div>

        <div className="about-hero-visual" aria-hidden="true">
          <div className="about-code-window">
            <div className="about-window-top">
              <span />
              <span />
              <span />
            </div>
            <div className="about-code-line about-code-line-muted">
              <b>01</b> learning.start()
            </div>
            <div className="about-code-line">
              <b>02</b> understand<span>.</span>concepts
            </div>
            <div className="about-code-line">
              <b>03</b> practice<span>.</span>daily
            </div>
            <div className="about-code-line">
              <b>04</b> build<span>.</span>projects
            </div>
            <div className="about-code-line">
              <b>05</b> grow<span>.</span>continuously
            </div>
            <div className="about-code-cursor">_</div>
          </div>
          <div className="about-floating-chip about-floating-chip-one">
            <span>&lt;/&gt;</span>
            <small>Learn by doing</small>
          </div>
          <div className="about-floating-chip about-floating-chip-two">
            <span>◆</span>
            <small>Build projects</small>
          </div>
        </div>
      </section>

      <Section
        description="Our teaching style is simple: explain the concept, build with it, review the result, then improve it."
        eyebrow="Learning Model"
        title="How we teach"
      >
        <div className="process-grid reboot-process-grid">
          {learningModel.map((item) => (
            <article className="process-card reboot-process-card" key={item.title}>
              <span className="process-number">{item.number}</span>
              <div className="process-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        description="The academy is designed around a straightforward idea: students should understand what they are doing and get opportunities to apply it."
        eyebrow="Our Approach"
        title="Learning that stays practical"
      >
        <div className="about-approach-layout">
          <div className="about-approach-main">
            <span className="about-quote-mark">“</span>
            <h3>Learn the concept. Practice the skill. Build something useful.</h3>
            <p>
              Programming becomes more meaningful when learners can connect
              concepts to actual features, applications, and projects. Our
              approach keeps that connection at the centre of the learning journey.
            </p>
            <p>
              Instead of treating every topic as an isolated lesson, the goal is
              to create a path where fundamentals support practice and practice
              leads naturally into project work.
            </p>
          </div>

          <div className="about-approach-points">
            <div>
              <strong>01</strong>
              <span>Strong fundamentals</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Hands-on practice</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Project application</span>
            </div>
            <div>
              <strong>04</strong>
              <span>Review and improvement</span>
            </div>
          </div>
        </div>
      </Section>

      <Section
        description="These principles shape how we think about practical programming education."
        eyebrow="What We Value"
        title="The principles behind Reboot"
      >
        <div className="about-values-grid">
          {academyValues.map((value) => (
            <article className="about-value-card" key={value.title}>
              <div className="about-value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        description="Whether you are starting from the basics or strengthening your existing skills, the learning journey should have a clear next step."
        eyebrow="Who We Support"
        title="Built for learners who want to build"
      >
        <div className="about-learners-layout">
          <div className="about-learners-intro">
            <div className="about-learners-badge">RCA</div>
            <h3>A practical path for growing technical skills</h3>
            <p>
              Reboot Code Academy focuses on learners who want to move from
              understanding programming concepts to confidently applying them.
            </p>
          </div>

          <div className="about-learners-list">
            {learnerFit.map((item, index) => (
              <div className="about-learner-item" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <section className="about-final-cta">
        <div className="about-final-cta-content">
          <span className="eyebrow">Your Next Step</span>
          <h2>Ready to start learning and building?</h2>
          <p>
            Explore the available courses or book a demo to understand which
            learning path fits your goals.
          </p>

          <div className="about-final-cta-actions">
            <button type="button" onClick={() => onNavigate('/courses')}>
              Explore Courses
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate('/contact')}
            >
              Book a Demo
            </button>
          </div>
        </div>

        <div className="about-final-cta-mark" aria-hidden="true">
          <span>&lt;/&gt;</span>
          <small>learn → practice → build → grow</small>
        </div>
      </section>
    </div>
  )
}

export default About
