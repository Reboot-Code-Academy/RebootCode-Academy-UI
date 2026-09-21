import Section from '../components/Section.jsx'
import { adminModules } from '../data/siteData.js'

function AdminDashboard() {
  return (
    <div className="page">
      <section className="page-hero compact-hero admin-hero">
        <span className="eyebrow">Admin Foundation</span>
        <h1>Website content management will live here.</h1>
        <p>
          This screen is the starting structure for managing courses, gallery
          images, homepage content, bookings, and student records.
        </p>
      </section>

      <Section
        description="These are placeholder modules for now. Later they will connect to FastAPI, PostgreSQL, and storage."
        eyebrow="Modules"
        title="Admin panel roadmap"
      >
        <div className="admin-grid">
          {adminModules.map((module) => (
            <article className="admin-card" key={module}>
              <span className="module-icon">{module.slice(0, 2)}</span>
              <h3>{module}</h3>
              <p>Ready for CRUD screens and role-based access.</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default AdminDashboard
