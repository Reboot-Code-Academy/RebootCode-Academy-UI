import { useEffect, useState } from 'react'
import Section from '../components/Section.jsx'

const STORAGE_KEY = 'reboot-code-academy-courses'

function Courses({ onNavigate }) {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const loadCourses = () => {
      const savedCourses = localStorage.getItem(STORAGE_KEY)

      if (!savedCourses) {
        setCourses([])
        return
      }

      try {
        setCourses(JSON.parse(savedCourses))
      } catch (error) {
        console.error('Could not read courses:', error)
        setCourses([])
      }
    }

    loadCourses()

    window.addEventListener('storage', loadCourses)
    window.addEventListener('focus', loadCourses)

    return () => {
      window.removeEventListener('storage', loadCourses)
      window.removeEventListener('focus', loadCourses)
    }
  }, [])

  const activeCourses = courses.filter(
    (course) => course.isActive !== false
  )

  return (
    <div className="page">

      {/* =========================================
          COURSES HERO
      ========================================= */}

      <section className="courses-page-hero">
        <div className="courses-hero-copy">
          <span className="eyebrow">Courses</span>

          <h1>
            Choose a practical course
            <span> and start building.</span>
          </h1>

          <p>
            Learn practical skills through structured training,
            hands-on practice, and real-world projects.
          </p>

          <div className="courses-hero-actions">
            <button
              type="button"
              onClick={() => onNavigate('/contact')}
            >
              Book a demo
            </button>

            <span className="courses-hero-note">
              Learn • Build • Grow
            </span>
          </div>
        </div>

        {/* CSS animated coding illustration.
            This is intentionally local, so the page does not depend
            on an external animation URL. */}
        <div
          className="courses-code-animation"
          aria-label="Animated coding illustration"
        >
          <div className="courses-orbit courses-orbit-one" />
          <div className="courses-orbit courses-orbit-two" />

          <div className="courses-laptop-glow" />

          <div className="courses-laptop">
            <div className="courses-laptop-screen">
              <div className="courses-code-topbar">
                <span />
                <span />
                <span />
                <b>reboot.js</b>
              </div>

              <div className="courses-code-body">
                <div className="code-line line-short">
                  <i>const</i> skill = <em>"coding"</em>
                </div>

                <div className="code-line line-medium">
                  <i>function</i> <strong>buildProject</strong>() {'{'}
                </div>

                <div className="code-line line-long">
                  &nbsp;&nbsp;learn<span>()</span>
                </div>

                <div className="code-line line-medium">
                  &nbsp;&nbsp;build<span>()</span>
                </div>

                <div className="code-line line-short">
                  &nbsp;&nbsp;grow<span>()</span>
                </div>

                <div className="code-line line-small">
                  {'}'}
                </div>

                <div className="courses-cursor" />
              </div>
            </div>

            <div className="courses-laptop-base">
              <span />
            </div>
          </div>

          <div className="courses-floating-chip chip-code">
            <b>&lt;/&gt;</b>
            <span>Code</span>
          </div>

          <div className="courses-floating-chip chip-ai">
            <b>AI</b>
            <span>Build with AI</span>
          </div>

          <div className="courses-floating-chip chip-react">
            <b>JS</b>
            <span>Web Development</span>
          </div>
        </div>
      </section>

      {/* =========================================
          COURSE LIST
      ========================================= */}

      <Section
        description="Each course is designed around fundamentals, hands-on practice, and real project outcomes."
        eyebrow="Programs"
        title="Available courses"
      >
        <div className="course-grid courses-page-grid">
          {activeCourses.length === 0 ? (
            <div className="courses-empty-state">
              <div className="courses-empty-icon">&lt;/&gt;</div>
              <h3>Courses are coming soon</h3>
              <p>
                No active courses are currently available. Please check
                again soon.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
              >
                Contact Academy
              </button>
            </div>
          ) : (
            activeCourses.map((course) => (
              <article
                className="course-card courses-page-card"
                key={course.id}
              >
                <div className="courses-card-image">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                        event.currentTarget.nextElementSibling?.classList.add(
                          'show'
                        )
                      }}
                    />
                  ) : null}

                  <div
                    className={
                      course.image
                        ? 'courses-card-image-fallback'
                        : 'courses-card-image-fallback show'
                    }
                    aria-hidden="true"
                  >
                    <span>&lt;/&gt;</span>
                  </div>
                </div>

                <div className="courses-card-content">
                  <span className="pill">
                    {course.level}
                  </span>

                  <h3>{course.name}</h3>

                  <p>{course.description}</p>

                  {course.topics?.length > 0 && (
                    <div className="topic-row">
                      {course.topics.map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="course-meta">
                  <span>{course.duration}</span>

                  <button
                    type="button"
                    onClick={() => onNavigate('/contact')}
                  >
                    Enquire
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </Section>

      {/* =========================================
          WHAT YOU'LL LEARN
      ========================================= */}

      <Section
        description="Build a strong foundation across programming, web development, AI, backend technologies, and real project work."
        eyebrow="Skills & Technologies"
        title="What you'll learn"
      >
        <div className="course-learning-grid">
          <article className="course-learning-card">
            <div className="course-learning-icon">&lt;/&gt;</div>
            <h3>Programming</h3>
            <p>Python, Java, JavaScript and core programming concepts.</p>
          </article>

          <article className="course-learning-card">
            <div className="course-learning-icon">&lt;web&gt;</div>
            <h3>Web Development</h3>
            <p>HTML, CSS, React and modern frontend development.</p>
          </article>

          <article className="course-learning-card">
            <div className="course-learning-icon">AI</div>
            <h3>AI & Automation</h3>
            <p>Explore AI tools, APIs and practical AI-powered applications.</p>
          </article>

          <article className="course-learning-card">
            <div className="course-learning-icon">DB</div>
            <h3>Backend & Database</h3>
            <p>Build backend services and work with databases and APIs.</p>
          </article>

          <article className="course-learning-card">
            <div className="course-learning-icon">01</div>
            <h3>Problem Solving</h3>
            <p>Improve logic, debugging, algorithms and coding confidence.</p>
          </article>

          <article className="course-learning-card">
            <div className="course-learning-icon">PR</div>
            <h3>Real Projects</h3>
            <p>Turn concepts into practical applications through projects.</p>
          </article>
        </div>
      </Section>

      {/* =========================================
          HOW LEARNING WORKS
      ========================================= */}

      <Section
        description="A simple learning path that takes you from understanding concepts to building practical projects."
        eyebrow="Learning Approach"
        title="How learning works"
      >
        <div className="learning-process">
          <article className="learning-process-step">
            <div className="learning-process-number">01</div>
            <div>
              <h3>Learn</h3>
              <p>Understand the fundamentals with structured lessons.</p>
            </div>
          </article>

          <div className="learning-process-arrow" aria-hidden="true">→</div>

          <article className="learning-process-step">
            <div className="learning-process-number">02</div>
            <div>
              <h3>Practice</h3>
              <p>Strengthen your understanding through coding exercises.</p>
            </div>
          </article>

          <div className="learning-process-arrow" aria-hidden="true">→</div>

          <article className="learning-process-step">
            <div className="learning-process-number">03</div>
            <div>
              <h3>Build</h3>
              <p>Apply what you learn by creating practical projects.</p>
            </div>
          </article>

          <div className="learning-process-arrow" aria-hidden="true">→</div>

          <article className="learning-process-step">
            <div className="learning-process-number">04</div>
            <div>
              <h3>Grow</h3>
              <p>Keep improving your skills with guided learning.</p>
            </div>
          </article>
        </div>
      </Section>

      {/* =========================================
          WHAT YOU GET
      ========================================= */}

      <Section
        description="More than lessons — a practical environment designed around learning, practice and building."
        eyebrow="Academy Experience"
        title="What you get"
      >
        <div className="course-benefits-grid">
          <article className="course-benefit-card">
            <span>01</span>
            <div>
              <h3>Project-Based Learning</h3>
              <p>Apply concepts by working on practical projects.</p>
            </div>
          </article>

          <article className="course-benefit-card">
            <span>02</span>
            <div>
              <h3>Hands-On Practice</h3>
              <p>Learn through coding exercises and practical activities.</p>
            </div>
          </article>

          <article className="course-benefit-card">
            <span>03</span>
            <div>
              <h3>Learning Guidance</h3>
              <p>Follow a structured path from fundamentals to projects.</p>
            </div>
          </article>

          <article className="course-benefit-card">
            <span>04</span>
            <div>
              <h3>Modern Technologies</h3>
              <p>Work with technologies used in current software development.</p>
            </div>
          </article>
        </div>
      </Section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="courses-final-cta">
        <div>
          <span className="eyebrow">Need Help Choosing?</span>
          <h2>Not sure which course is right for you?</h2>
          <p>
            Talk to us about your current skills and learning goals.
            We can help you understand the available courses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/contact')}
        >
          Book a demo
        </button>
      </section>

    </div>
  )
}

export default Courses
