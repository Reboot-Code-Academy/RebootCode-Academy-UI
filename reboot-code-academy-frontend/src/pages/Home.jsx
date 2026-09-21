import { useEffect, useMemo, useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import AnnouncementTicker from '../components/AnnouncementTicker.jsx'
import Section from '../components/Section.jsx'
import { courses as defaultCourses, stats } from '../data/siteData.js'
import { fetchHelloMessage } from '../services/api.js'

const ANNOUNCEMENTS_KEY = 'reboot-code-academy-announcements'
const COURSES_KEY = 'reboot-code-academy-courses'
const TESTIMONIALS_KEY = 'reboot-code-academy-testimonials'

// Free coding animation source.
const HERO_ANIMATION =
  'https://assets2.lottiefiles.com/packages/lf20_0yfsb3a1.json'

function Home({ onNavigate }) {
  const [apiMessage, setApiMessage] = useState('Checking backend...')
  const [managedAnnouncements, setManagedAnnouncements] = useState([])
  const [managedCourses, setManagedCourses] = useState([])
  const [managedTestimonials, setManagedTestimonials] = useState([])
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  // =========================================
  // LOAD ANNOUNCEMENTS
  // =========================================

  useEffect(() => {
    const loadAnnouncements = () => {
      const saved = localStorage.getItem(ANNOUNCEMENTS_KEY)

      if (!saved) {
        setManagedAnnouncements([])
        return
      }

      try {
        setManagedAnnouncements(JSON.parse(saved))
      } catch (error) {
        console.error('Could not read announcements:', error)
        setManagedAnnouncements([])
      }
    }

    loadAnnouncements()
    window.addEventListener('storage', loadAnnouncements)
    window.addEventListener('focus', loadAnnouncements)

    return () => {
      window.removeEventListener('storage', loadAnnouncements)
      window.removeEventListener('focus', loadAnnouncements)
    }
  }, [])

  // =========================================
  // LOAD COURSES
  // =========================================

  useEffect(() => {
    const loadCourses = () => {
      const saved = localStorage.getItem(COURSES_KEY)

      if (!saved) {
        setManagedCourses([])
        return
      }

      try {
        setManagedCourses(JSON.parse(saved))
      } catch (error) {
        console.error('Could not read courses:', error)
        setManagedCourses([])
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

  // =========================================
  // LOAD TESTIMONIALS
  // =========================================

  useEffect(() => {
    const loadTestimonials = () => {
      const saved = localStorage.getItem(TESTIMONIALS_KEY)

      if (!saved) {
        setManagedTestimonials([])
        return
      }

      try {
        setManagedTestimonials(JSON.parse(saved))
      } catch (error) {
        console.error('Could not read testimonials:', error)
        setManagedTestimonials([])
      }
    }

    loadTestimonials()
    window.addEventListener('storage', loadTestimonials)
    window.addEventListener('focus', loadTestimonials)

    return () => {
      window.removeEventListener('storage', loadTestimonials)
      window.removeEventListener('focus', loadTestimonials)
    }
  }, [])

  // =========================================
  // ACTIVE ANNOUNCEMENTS
  // =========================================

  const activeAnnouncements = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return managedAnnouncements.filter((announcement) => {
      if (announcement.isActive === false) return false

      if (announcement.startDate) {
        const startDate = new Date(`${announcement.startDate}T00:00:00`)
        if (today < startDate) return false
      }

      if (announcement.endDate) {
        const endDate = new Date(`${announcement.endDate}T23:59:59`)
        if (today > endDate) return false
      }

      return true
    })
  }, [managedAnnouncements])

  // =========================================
  // ACTIVE COURSES
  // =========================================

  const activeCourses = useMemo(() => {
    if (!managedCourses.length) return defaultCourses

    return managedCourses.filter((course) => course.isActive !== false)
  }, [managedCourses])

  // =========================================
  // ACTIVE TESTIMONIALS
  // =========================================

  const activeTestimonials = useMemo(() => {
    return managedTestimonials.filter(
      (testimonial) => testimonial.isActive !== false
    )
  }, [managedTestimonials])

  // =========================================
  // TESTIMONIAL AUTO SLIDER
  // =========================================

  useEffect(() => {
    if (activeTestimonials.length <= 1) {
      setTestimonialIndex(0)
      return
    }

    if (testimonialIndex >= activeTestimonials.length) {
      setTestimonialIndex(0)
      return
    }

    const interval = setInterval(() => {
      setTestimonialIndex(
        (current) => (current + 1) % activeTestimonials.length
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [activeTestimonials.length, testimonialIndex])

  // =========================================
  // BACKEND STATUS
  // =========================================

  useEffect(() => {
    fetchHelloMessage()
      .then((message) => setApiMessage(message))
      .catch(() => setApiMessage('Backend is not connected yet'))
  }, [])

  return (
    <div className="page">

      {/* =========================================
          ANNOUNCEMENTS
      ========================================= */}

      <div className="announcement-band">
        <AnnouncementTicker
          announcements={activeAnnouncements}
          onNavigate={onNavigate}
        />
      </div>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="hero-section reboot-home-hero">
        <div className="hero-copy reboot-hero-copy">
          <span className="eyebrow">Reboot Code Academy</span>

          <h1>
            Learn. Build.
            <span className="hero-highlight"> Grow.</span>
          </h1>

          <p>
            Learn programming through practical training, real projects,
            and modern technologies. Build skills you can actually use.
          </p>

          <div className="hero-actions">
            <button type="button" onClick={() => onNavigate('/courses')}>
              Explore courses
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={() => onNavigate('/contact')}
            >
              Book a demo
            </button>
          </div>

          <div className="hero-trust-row">
            <span>✓ Practical training</span>
            <span>✓ Project based</span>
            <span>✓ Modern technologies</span>
          </div>
        </div>

        <div className="hero-panel reboot-hero-animation">
          <div className="hero-animation-orbit orbit-one" />
          <div className="hero-animation-orbit orbit-two" />

          <div className="hero-animation-card">
            <DotLottieReact
              src={HERO_ANIMATION}
              autoplay
              loop
            />
          </div>

          <div className="hero-floating-label hero-floating-label-one">
            <span className="floating-label-icon">&lt;/&gt;</span>
            <span>Code</span>
          </div>

          <div className="hero-floating-label hero-floating-label-two">
            <span className="floating-label-icon">AI</span>
            <span>Build with AI</span>
          </div>
        </div>
      </section>

      {/* =========================================
          STATS
      ========================================= */}

      <section className="stats-grid" aria-label="Academy highlights">
        {stats.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      {/* =========================================
          POPULAR COURSES
      ========================================= */}

      <Section
        description="Choose a learning path and build your skills through practical lessons, coding exercises, and projects."
        eyebrow="Popular Courses"
        title="Learn the skills that matter"
      >
        <div className="course-grid reboot-course-grid">
          {activeCourses.slice(0, 6).map((course) => (
            <article
              className="course-card reboot-course-card"
              key={course.id || course.name}
            >
              <div className="course-visual">
                {course.image ? (
                  <img
                    src={course.image}
                    alt=""
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
                      ? 'course-visual-fallback'
                      : 'course-visual-fallback show'
                  }
                  aria-hidden="true"
                >
                  <span>&lt;/&gt;</span>
                </div>
              </div>

              <div className="course-card-content">
                <span className="pill">{course.level}</span>

                <h3>{course.name}</h3>

                <p>{course.description}</p>
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
          ))}
        </div>

        {activeCourses.length > 6 && (
          <div className="home-section-action">
            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate('/courses')}
            >
              View all courses
            </button>
          </div>
        )}
      </Section>

      {/* =========================================
          WHY REBOOT
      ========================================= */}

      <Section
        description="A practical learning approach designed to help students understand concepts and apply them through projects."
        eyebrow="Why Reboot Code Academy"
        title="Learn by doing, not just watching"
      >
        <div className="feature-grid reboot-feature-grid">
          <article className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Practical Training</h3>
            <p>
              Learn concepts through hands-on coding exercises and
              project-based practice.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">02</div>
            <h3>Industry Technologies</h3>
            <p>
              Build skills around technologies used in modern software
              development.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">03</div>
            <h3>Project Experience</h3>
            <p>
              Turn your learning into practical projects that demonstrate
              what you can build.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">04</div>
            <h3>Clear Learning Path</h3>
            <p>
              Move from fundamentals to advanced topics with a structured
              learning journey.
            </p>
          </article>
        </div>
      </Section>

      {/* =========================================
          OUR LEARNING APPROACH
      ========================================= */}

      <Section
        description="A practical learning approach designed to move you from understanding concepts to building useful projects."
        eyebrow="Our Learning Approach"
        title="From learning to building"
      >
        <div className="learning-path-grid">
          {[
            ['01', '⌕', 'Discover', 'Understand your goals, choose the right learning path, and start with the fundamentals.'],
            ['02', '</>', 'Learn', 'Build strong concepts through structured lessons, examples, and guided coding practice.'],
            ['03', '⚙', 'Practice', 'Strengthen your skills with coding exercises, problem solving, and hands-on tasks.'],
            ['04', '◆', 'Build', 'Apply what you learn by creating practical projects with modern technologies.'],
            ['05', '↗', 'Grow', 'Keep improving your skills and turn your project experience into real opportunities.'],
          ].map(([step, icon, title, description], index) => (
            <article className={`learning-path-card ${index === 4 ? 'learning-path-card-final' : ''}`} key={step}>
              <span className="learning-step">{step}</span>
              <div className="learning-path-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* =========================================
          EXPLORE WHAT WE TEACH
      ========================================= */}

      <Section
        description="Explore the technology areas covered across our practical training programs."
        eyebrow="Explore What We Teach"
        title="Build skills across the modern tech stack"
      >
        <div className="teaching-grid">
          {[
            ['</>', 'Programming', 'Python, Java, JavaScript and strong programming fundamentals.', 'programming'],
            ['▣', 'Full Stack Development', 'Frontend, backend, APIs, databases and complete web applications.', 'fullstack'],
            ['AI', 'AI & Machine Learning', 'AI concepts, automation and modern tools for building intelligent solutions.', 'ai'],
            ['DB', 'Backend & Database', 'Server-side development, APIs, SQL and application data management.', 'backend'],
            ['◆', 'Real Projects', 'Apply concepts by building practical projects that demonstrate your skills.', 'projects'],
            ['?', 'Problem Solving', 'Improve logical thinking, debugging skills and coding confidence.', 'problem'],
          ].map(([icon, title, description, type]) => (
            <article className={`teaching-card teaching-card-${type}`} key={title}>
              <div className="teaching-card-icon">{icon}</div>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* =========================================
          TESTIMONIALS
      ========================================= */}

      {activeTestimonials.length > 0 && (
        <Section
          description="Hear from students about their learning experience at Reboot Code Academy."
          eyebrow="Student Feedback"
          title="What our students say"
        >
          <div className="testimonial-carousel">
            <button
              type="button"
              className="testimonial-arrow"
              onClick={() =>
                setTestimonialIndex(
                  (current) =>
                    (current - 1 + activeTestimonials.length) %
                    activeTestimonials.length
                )
              }
              aria-label="Previous testimonial"
            >
              ←
            </button>

            <div className="testimonial-slider">
              <div className="testimonial-track">
                {(() => {
                  const testimonial = activeTestimonials[testimonialIndex]

                  return (
                    <article
                      className="testimonial-modern-card"
                      key={testimonial.id}
                    >
                      <div className="testimonial-student">
                        <div className="testimonial-avatar">
                          {testimonial.image ? (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                            />
                          ) : (
                            <span>
                              {testimonial.name
                                ?.charAt(0)
                                ?.toUpperCase() || 'S'}
                            </span>
                          )}
                        </div>

                        <div className="testimonial-student-info">
                          <h3>{testimonial.name}</h3>
                          <span>{testimonial.course}</span>
                        </div>
                      </div>

                      <div
                        className="testimonial-stars"
                        aria-label={`Rating: ${testimonial.rating} out of 5`}
                      >
                        {'★'.repeat(Number(testimonial.rating) || 0)}
                        {'☆'.repeat(
                          5 - (Number(testimonial.rating) || 0)
                        )}
                      </div>

                      <p className="testimonial-review">
                        “{testimonial.review}”
                      </p>
                    </article>
                  )
                })()}
              </div>
            </div>

            <button
              type="button"
              className="testimonial-arrow"
              onClick={() =>
                setTestimonialIndex(
                  (current) =>
                    (current + 1) % activeTestimonials.length
                )
              }
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>

          {activeTestimonials.length > 1 && (
            <div className="testimonial-dots">
              {activeTestimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  type="button"
                  className={
                    index === testimonialIndex
                      ? 'testimonial-dot active'
                      : 'testimonial-dot'
                  }
                  onClick={() => setTestimonialIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </Section>
      )}

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="home-final-cta">
        <div className="home-final-cta-glow home-final-cta-glow-one" />
        <div className="home-final-cta-glow home-final-cta-glow-two" />

        <div className="home-final-cta-content">
          <span className="eyebrow">Start Your Journey</span>
          <h2>Ready to build your future in technology?</h2>
          <p>
            Choose a practical course, learn with guidance, and start building
            projects that turn your knowledge into real skills.
          </p>

          <div className="home-final-cta-actions">
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

        <div className="home-final-cta-code" aria-hidden="true">
          <span>{'const'} future = {'{'}</span>
          <span>&nbsp;&nbsp;learn: true,</span>
          <span>&nbsp;&nbsp;build: true,</span>
          <span>&nbsp;&nbsp;grow: true</span>
          <span>{'}'}</span>
        </div>
      </section>

      {/* Development-only backend status */}
      
    </div>
  )
}

export default Home
