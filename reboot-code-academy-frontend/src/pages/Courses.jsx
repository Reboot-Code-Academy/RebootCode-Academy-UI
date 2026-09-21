import Section from '../components/Section.jsx'
import { courses } from '../data/siteData.js'

function Courses({ onNavigate }) {
  return (
    <div className="page">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Courses</span>
        <h1>Choose a practical course and start building.</h1>
        <p>
          These course cards currently use temporary frontend data. Later the
          same UI will read from FastAPI and Supabase.
        </p>
      </section>

      <Section
        description="Each course is designed around fundamentals, hands-on practice, and real project outcomes."
        eyebrow="Programs"
        title="Available courses"
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
              <div className="topic-row">
                {course.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default Courses
