import { useEffect, useState } from 'react'
import heroImage from '../assets/hero.png'
import AnnouncementTicker from '../components/AnnouncementTicker.jsx'
import Section from '../components/Section.jsx'
import { announcements, courses, stats } from '../data/siteData.js'
import { fetchHelloMessage } from '../services/api.js'

function Home({ onNavigate }) {
  const [apiMessage, setApiMessage] = useState('Checking backend...')

  useEffect(() => {
    fetchHelloMessage()
      .then((message) => {
        setApiMessage(message)
      })
      .catch(() => {
        setApiMessage('Backend is not connected yet')
      })
  }, [])

  return (
    <div className="page">
      <div className="announcement-band">
        <AnnouncementTicker announcements={announcements} onNavigate={onNavigate} />
      </div>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Reboot Code Academy</span>
          <h1>Learn programming by building real projects.</h1>
          <p>
            Practical courses in Python, Java, web development, and full-stack
            foundations for students who want clear direction and hands-on
            practice.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              onClick={() => {
                onNavigate('/courses')
              }}
            >
              Explore courses
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                onNavigate('/contact')
              }}
            >
              Book demo
            </button>
          </div>
        </div>

        <div className="hero-panel" aria-label="Academy technology visual">
          <img alt="" src={heroImage} />
          <div className="code-window">
            <div>
              <span />
              <span />
              <span />
            </div>
            <pre>{`function learn() {
  buildProject()
  improveSkill()
}`}</pre>
          </div>
        </div>
      </section>

      <div className="status-strip">
        <strong>FastAPI status</strong>
        <span>{apiMessage}</span>
      </div>

      <section className="stats-grid" aria-label="Academy highlights">
        {stats.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <Section
        description="Start with beginner-friendly lessons, then move into projects and backend/frontend integration."
        eyebrow="Popular Courses"
        title="Build skills step by step"
      >
        <div className="course-grid">
          {courses.map((course) => (
            <article className="course-card" key={course.id}>
              <div>
                <span className="pill">{course.level}</span>
                <h3>{course.name}</h3>
                <p>{course.description}</p>
              </div>
              <div className="course-meta">
                <span>{course.duration}</span>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/contact')
                  }}
                >
                  Enquire
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        className="split-section"
        description="The public website and admin panel are being built together, so content like course details, gallery images, and homepage text can become manageable later."
        eyebrow="Admin Ready"
        title="Designed for future content management"
      >
        <div className="split-panel">
          <div>
            <h3>Code controls layout</h3>
            <p>
              Navigation, responsive design, buttons, and page structure remain
              in React and CSS.
            </p>
          </div>
          <div>
            <h3>Database controls content</h3>
            <p>
              Courses, gallery, testimonials, contact details, and homepage
              content can come from FastAPI later.
            </p>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default Home
