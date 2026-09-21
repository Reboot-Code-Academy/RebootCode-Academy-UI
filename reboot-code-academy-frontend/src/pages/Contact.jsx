import { useEffect, useMemo, useState } from 'react'
import Section from '../components/Section.jsx'

const CONTACT_KEY = 'reboot-code-academy-contact-information'
const COURSES_KEY = 'reboot-code-academy-courses'
const BOOKINGS_KEY = 'reboot-code-academy-demo-bookings'

const defaultContact = {
  phone: '',
  whatsapp: '',
  email: '',
  supportEmail: '',
  addressLine1: '',
  addressLine2: '',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  youtube: '',
  telegram: '',
  mondayFriday: '09:00 AM - 07:00 PM',
  saturday: '09:00 AM - 05:00 PM',
  sunday: 'Closed',
  googleMapsUrl: '',
}

function Contact({ onNavigate }) {
  const [contact, setContact] = useState(defaultContact)
  const [courses, setCourses] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  })

  useEffect(() => {
    const loadContact = () => {
      try {
        const savedContact = localStorage.getItem(CONTACT_KEY)

        if (!savedContact) {
          setContact(defaultContact)
          return
        }

        setContact({
          ...defaultContact,
          ...JSON.parse(savedContact),
        })
      } catch (error) {
        console.error('Could not load contact information:', error)
        setContact(defaultContact)
      }
    }

    loadContact()

    window.addEventListener('storage', loadContact)
    window.addEventListener('focus', loadContact)

    return () => {
      window.removeEventListener('storage', loadContact)
      window.removeEventListener('focus', loadContact)
    }
  }, [])

  useEffect(() => {
    const loadCourses = () => {
      try {
        const savedCourses = localStorage.getItem(COURSES_KEY)

        if (!savedCourses) {
          setCourses([])
          return
        }

        const parsedCourses = JSON.parse(savedCourses)

        setCourses(
          parsedCourses.filter((course) => course.isActive !== false)
        )
      } catch (error) {
        console.error('Could not load courses:', error)
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

  const fullAddress = useMemo(() => {
    return [
      contact.addressLine1,
      contact.addressLine2,
      [contact.city, contact.state].filter(Boolean).join(', '),
      contact.pincode,
    ]
      .filter(Boolean)
      .join(', ')
  }, [contact])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (submitted) {
      setSubmitted(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newBooking = {
      id: Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      course: formData.course,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      message: formData.message.trim(),
      status: 'New',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    }

    let existingBookings = []

    try {
      existingBookings =
        JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []
    } catch (error) {
      console.error('Could not read existing bookings:', error)
    }

    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify([newBooking, ...existingBookings])
    )

    setSubmitted(true)

    setFormData({
      name: '',
      phone: '',
      email: '',
      course: '',
      preferredDate: '',
      preferredTime: '',
      message: '',
    })
  }

  return (
    <div className="page reboot-contact-page">
      <section className="page-hero compact-hero reboot-contact-hero">
        <div className="contact-hero-content">
          <span className="eyebrow">Book a Demo</span>

          <h1>Start your learning journey with us.</h1>

          <p>
            Book a free demo class or send us your course enquiry. Our team will
            help you choose the right learning path.
          </p>

          <div className="contact-hero-actions">
            <a
              href={contact.whatsapp
                ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`
                : '#contact-form'}
              target={contact.whatsapp ? '_blank' : undefined}
              rel={contact.whatsapp ? 'noreferrer' : undefined}
              className="contact-hero-link"
            >
              {contact.whatsapp ? 'Chat on WhatsApp' : 'Send an Enquiry'}
            </a>

            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="contact-hero-link secondary">
                Call Us
              </a>
            )}
          </div>
        </div>

        <div className="contact-hero-visual" aria-hidden="true">
          <div className="contact-hero-card">
            <span className="contact-hero-icon">◆</span>
            <strong>Let's build your learning path.</strong>
            <small>Choose a course → book a demo → start building</small>
          </div>

          <div className="contact-floating-card contact-floating-one">
            <span>01</span>
            <small>Choose your course</small>
          </div>

          <div className="contact-floating-card contact-floating-two">
            <span>02</span>
            <small>Book your demo</small>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Reach Us"
        title="Let's talk about your learning goals"
        description="Choose a course, tell us what you want to learn, and request a free demo. We will use your details to follow up."
      >
        <div className="contact-layout reboot-contact-layout">
          <aside className="contact-panel reboot-contact-panel">
            <div className="contact-info-heading">
              <span>RCA</span>
              <div>
                <h3>Reboot Code Academy</h3>
                <p>Programming &amp; technology training</p>
              </div>
            </div>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">☎</div>
                <div>
                  <strong>Phone</strong>
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  ) : (
                    <span>Contact number will be updated soon.</span>
                  )}
                </div>
              </div>

              {contact.whatsapp && (
                <div className="contact-info-item">
                  <div className="contact-info-icon">WA</div>
                  <div>
                    <strong>WhatsApp</strong>
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                </div>
              )}

              <div className="contact-info-item">
                <div className="contact-info-icon">@</div>
                <div>
                  <strong>Email</strong>
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  ) : (
                    <span>Email will be updated soon.</span>
                  )}
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">⌖</div>
                <div>
                  <strong>Location</strong>
                  <span>
                    {fullAddress || 'Academy location will be updated soon.'}
                  </span>

                  {contact.googleMapsUrl && (
                    <a
                      className="contact-map-link"
                      href={contact.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="contact-panel-divider" />

            <div className="contact-demo-note">
              <div className="contact-demo-note-icon">✓</div>
              <div>
                <strong>What happens after you enquire?</strong>
                <p>
                  We review your request, understand your learning requirement,
                  and get in touch to help you with the next step.
                </p>
              </div>
            </div>

            {(contact.mondayFriday ||
              contact.saturday ||
              contact.sunday) && (
              <>
                <div className="contact-panel-divider" />

                <div className="contact-hours">
                  <strong>Working Hours</strong>

                  <span>
                    Monday - Friday: {contact.mondayFriday}
                  </span>

                  <span>Saturday: {contact.saturday}</span>

                  <span>Sunday: {contact.sunday}</span>
                </div>
              </>
            )}
          </aside>

          <form
            id="contact-form"
            className="contact-form reboot-contact-form"
            onSubmit={handleSubmit}
          >
            <div className="contact-form-heading">
              <span className="contact-form-step">FREE DEMO</span>
              <h3>Book your demo class</h3>
              <p>Tell us a little about yourself and what you want to learn.</p>
            </div>

            {submitted && (
              <div className="contact-success" role="status">
                <span>✓</span>
                <div>
                  <strong>Demo request submitted</strong>
                  <p>
                    Thank you. Your request has been sent to the academy team.
                  </p>
                </div>
              </div>
            )}

            <div className="contact-form-fields">
              <label>
                Full Name *
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone Number *
                <input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Interested Course *
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a course
                  </option>

                  <option value="Not Sure">
                    Not Sure / Need Guidance
                  </option>

                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-grid">
                <label>
                  Preferred Date
                  <input
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Preferred Time
                  <input
                    name="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label>
                Message / Learning Requirement
                <textarea
                  name="message"
                  placeholder="Tell us what you want to learn or ask..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                />
              </label>
            </div>

            <button className="contact-submit-button" type="submit">
              Book Free Demo →
            </button>

            <p className="contact-form-note">
              Your enquiry will be saved securely for the academy team to
              follow up.
            </p>
          </form>
        </div>
      </Section>

      <Section
        eyebrow="Why Book a Demo?"
        title="Get clarity before you start"
        description="A demo gives you an opportunity to understand the learning path before making a decision."
      >
        <div className="contact-benefits-grid">
          <article className="contact-benefit-card">
            <div className="contact-benefit-number">01</div>
            <h3>Understand the Course</h3>
            <p>
              Get a clearer idea of what you will learn and how the course is
              structured.
            </p>
          </article>

          <article className="contact-benefit-card">
            <div className="contact-benefit-number">02</div>
            <h3>Ask Your Questions</h3>
            <p>
              Discuss your current skill level, goals, doubts and learning
              requirements.
            </p>
          </article>

          <article className="contact-benefit-card">
            <div className="contact-benefit-number">03</div>
            <h3>Choose Your Path</h3>
            <p>
              Understand which available learning path aligns with what you
              want to build.
            </p>
          </article>
        </div>
      </Section>

      <section className="contact-final-cta">
        <div>
          <span className="eyebrow">Have Questions?</span>
          <h2>Let's find the right learning path for you.</h2>
          <p>
            You can explore the courses first or send us your enquiry directly.
          </p>
        </div>

        <div className="contact-final-actions">
          <button type="button" onClick={() => onNavigate('/courses')}>
            Explore Courses
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              document.getElementById('contact-form')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
          >
            Book a Demo
          </button>
        </div>
      </section>
    </div>
  )
}

export default Contact
