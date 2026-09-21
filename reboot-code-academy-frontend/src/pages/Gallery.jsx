import Section from '../components/Section.jsx'
import { galleryItems } from '../data/siteData.js'

function Gallery() {
  return (
    <div className="page">
      <section className="page-hero compact-hero">
        <span className="eyebrow">Gallery</span>
        <h1>Moments from classes, labs, and project work.</h1>
        <p>
          The gallery is prepared for future Supabase Storage images. For now,
          these are structured placeholders.
        </p>
      </section>

      <Section eyebrow="Campus Life" title="Learning in action">
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <article className="gallery-card" key={item.title}>
              <div className={`gallery-visual visual-${index + 1}`}>
                <span>{item.category}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default Gallery
