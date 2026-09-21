import Section from '../components/Section.jsx'
import { contactInfo } from '../data/siteData.js'

function Contact() {
  return (
    <div className="page">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Contact Us</span>
        <h1>Book a demo class or ask about a course.</h1>
        <p>
          Share what you want to learn and we will help you choose the right
          path.
        </p>
      </section>

      <Section eyebrow="Reach Us" title="Start the conversation">
        <div className="contact-layout">
          <div className="contact-panel">
            <strong>Phone</strong>
            <span>{contactInfo.phone}</span>
            <strong>Email</strong>
            <span>{contactInfo.email}</span>
            <strong>Location</strong>
            <span>{contactInfo.address}</span>
          </div>

          <form className="contact-form">
            <label>
              Name
              <input placeholder="Your name" type="text" />
            </label>
            <label>
              Phone
              <input placeholder="Your phone number" type="tel" />
            </label>
            <label>
              Course
              <select defaultValue="">
                <option disabled value="">
                  Select a course
                </option>
                <option>Python Programming</option>
                <option>Java Full Stack</option>
                <option>Web Development</option>
              </select>
            </label>
            <label>
              Message
              <textarea placeholder="Tell us what you want to learn" rows="4" />
            </label>
            <button type="button">Send enquiry</button>
          </form>
        </div>
      </Section>
    </div>
  )
}

export default Contact
