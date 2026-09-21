import { useEffect, useMemo, useState } from 'react'
import Section from '../components/Section.jsx'

const STORAGE_KEY = 'reboot-code-academy-gallery'

const galleryCategories = [
  'All',
  'Classroom',
  'Events',
  'Workshops',
  'Students',
  'Projects',
  'Campus',
]

function Gallery({ onNavigate }) {
  const [galleryItems, setGalleryItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    loadGallery()

    function handleStorageChange(event) {
      if (event.key === STORAGE_KEY) {
        loadGallery()
      }
    }

    function handleFocus() {
      loadGallery()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setSelectedItem(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function loadGallery() {
    const savedGallery = localStorage.getItem(STORAGE_KEY)

    if (!savedGallery) {
      setGalleryItems([])
      return
    }

    try {
      const parsedGallery = JSON.parse(savedGallery)

      const activeItems = parsedGallery.filter(
        (item) => item.isActive !== false
      )

      setGalleryItems(activeItems)
    } catch (error) {
      console.error('Failed to load gallery:', error)
      setGalleryItems([])
    }
  }

  const availableCategories = useMemo(() => {
    const usedCategories = new Set(
      galleryItems
        .map((item) => item.category)
        .filter(Boolean)
    )

    return galleryCategories.filter(
      (category) => category === 'All' || usedCategories.has(category)
    )
  }, [galleryItems])

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return galleryItems
    }

    return galleryItems.filter(
      (item) => item.category === selectedCategory
    )
  }, [galleryItems, selectedCategory])

  const categoryCounts = useMemo(() => {
    return galleryItems.reduce((counts, item) => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1
      }
      return counts
    }, {})
  }, [galleryItems])

  return (
    <div className="page reboot-gallery-page">
      <section className="page-hero compact-hero reboot-gallery-hero">
        <div className="gallery-hero-content">
          <span className="eyebrow">Gallery</span>

          <h1>Moments from classes, labs, and project work.</h1>

          <p>
            Explore classroom activities, workshops, projects and learning
            experiences at Reboot Code Academy.
          </p>

          <div className="gallery-hero-actions">
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

        <div className="gallery-hero-visual" aria-hidden="true">
          <div className="gallery-photo-stack">
            <div className="gallery-photo-card gallery-photo-card-back">
              <span>&lt;/&gt;</span>
            </div>
            <div className="gallery-photo-card gallery-photo-card-middle">
              <span>◆</span>
            </div>
            <div className="gallery-photo-card gallery-photo-card-front">
              <span>RCA</span>
              <small>Learning in action</small>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Campus Life"
        title="Learning in action"
        description="Browse the latest moments shared through the academy gallery."
      >
        {galleryItems.length === 0 ? (
          <div className="gallery-empty reboot-gallery-empty">
            <div className="gallery-empty-icon">◆</div>
            <h3>No gallery items available</h3>
            <p>
              Gallery content will be added soon. Check back for classroom
              activities, workshops, projects and academy moments.
            </p>
          </div>
        ) : (
          <>
            <div className="gallery-toolbar">
              <div className="gallery-filter-list">
                {availableCategories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={
                      selectedCategory === category
                        ? 'gallery-filter active'
                        : 'gallery-filter'
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    {category !== 'All' && (
                      <span>{categoryCounts[category] || 0}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="gallery-result-count">
                {filteredItems.length}{' '}
                {filteredItems.length === 1 ? 'moment' : 'moments'}
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="gallery-filter-empty">
                <h3>No items in this category</h3>
                <p>Choose another category to view more gallery content.</p>
              </div>
            ) : (
              <div className="gallery-grid reboot-gallery-grid">
                {filteredItems.map((item, index) => (
                  <article
                    className="gallery-card reboot-gallery-card"
                    key={item.id || item.title || index}
                  >
                    <button
                      type="button"
                      className="gallery-image-button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`View ${item.title}`}
                    >
                      <div
                        className={`gallery-visual visual-${
                          (index % 3) + 1
                        }`}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.title} />
                        ) : (
                          <div className="gallery-visual-placeholder">
                            <span>&lt;/&gt;</span>
                            <small>{item.category || 'Academy'}</small>
                          </div>
                        )}

                        <span className="gallery-category-badge">
                          {item.category || 'Academy'}
                        </span>

                        <span className="gallery-view-badge">
                          View
                        </span>
                      </div>
                    </button>

                    <div className="gallery-card-content">
                      <span className="gallery-card-category">
                        {item.category || 'Academy'}
                      </span>

                      <h3>{item.title || 'Academy moment'}</h3>

                      {item.description && (
                        <p>{item.description}</p>
                      )}

                      {item.videoUrl && (
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="gallery-video-button"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <span>▶</span>
                          Watch Video
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {galleryItems.length > 0 && (
        <Section
          eyebrow="Inside Reboot"
          title="More than just a classroom"
          description="Learning happens through practice, collaboration, projects and experiences that help students connect ideas with real work."
        >
          <div className="gallery-experience-grid">
            <article className="gallery-experience-card">
              <div className="gallery-experience-icon">&lt;/&gt;</div>
              <h3>Classroom Learning</h3>
              <p>
                Follow structured lessons and strengthen concepts through
                guided coding practice.
              </p>
            </article>

            <article className="gallery-experience-card">
              <div className="gallery-experience-icon">⚙</div>
              <h3>Hands-On Practice</h3>
              <p>
                Turn concepts into working features through exercises and
                practical tasks.
              </p>
            </article>

            <article className="gallery-experience-card">
              <div className="gallery-experience-icon">◆</div>
              <h3>Project Work</h3>
              <p>
                Apply your learning by creating useful websites, applications
                and technology projects.
              </p>
            </article>

            <article className="gallery-experience-card">
              <div className="gallery-experience-icon">↗</div>
              <h3>Growth Moments</h3>
              <p>
                Review progress, learn from feedback and keep improving your
                technical skills.
              </p>
            </article>
          </div>
        </Section>
      )}

      <section className="gallery-final-cta">
        <div className="gallery-final-cta-content">
          <span className="eyebrow">See It. Learn It. Build It.</span>
          <h2>Want to create your own project story?</h2>
          <p>
            Explore our courses and start building practical skills with
            Reboot Code Academy.
          </p>

          <div className="gallery-final-cta-actions">
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

        <div className="gallery-final-cta-mark" aria-hidden="true">
          <span>&lt;/&gt;</span>
          <small>learn → practice → build</small>
        </div>
      </section>

      {selectedItem && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title || 'Gallery image'}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="gallery-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Close gallery preview"
            >
              ×
            </button>

            <div className="gallery-lightbox-image">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title || 'Gallery'}
                />
              ) : (
                <div className="gallery-lightbox-placeholder">
                  <span>&lt;/&gt;</span>
                </div>
              )}
            </div>

            <div className="gallery-lightbox-info">
              <span>{selectedItem.category || 'Academy'}</span>
              <h3>{selectedItem.title || 'Academy moment'}</h3>
              {selectedItem.description && (
                <p>{selectedItem.description}</p>
              )}

              {selectedItem.videoUrl && (
                <a
                  href={selectedItem.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="gallery-video-button"
                >
                  <span>▶</span>
                  Watch Video
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
