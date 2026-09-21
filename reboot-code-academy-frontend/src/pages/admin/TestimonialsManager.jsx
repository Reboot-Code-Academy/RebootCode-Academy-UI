import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'reboot-code-academy-testimonials'

const defaultTestimonials = [
  {
    id: 1,
    name: 'Rahul Kumar',
    course: 'Python Full Stack',
    review:
      'The practical sessions helped me understand development concepts much better.',
    rating: 5,
    image: '',
    isActive: true,
  },
  {
    id: 2,
    name: 'Sneha Reddy',
    course: 'Java Full Stack',
    review:
      'The mentors were supportive and explained the concepts clearly through projects.',
    rating: 5,
    image: '',
    isActive: true,
  },
]

const emptyForm = {
  name: '',
  course: '',
  review: '',
  rating: 5,
  image: '',
}

function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const imageInputRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const savedTestimonials = localStorage.getItem(STORAGE_KEY)

    if (savedTestimonials) {
      try {
        setTestimonials(JSON.parse(savedTestimonials))
      } catch {
        setTestimonials(defaultTestimonials)
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(defaultTestimonials)
        )
      }
    } else {
      setTestimonials(defaultTestimonials)

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultTestimonials)
      )
    }
  }, [])

  function saveTestimonials(updatedTestimonials) {
    setTestimonials(updatedTestimonials)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedTestimonials)
    )
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  function handleEdit(testimonial) {
    setEditingId(testimonial.id)

    setForm({
      name: testimonial.name || '',
      course: testimonial.course || '',
      review: testimonial.review || '',
      rating: testimonial.rating || 5,
      image: testimonial.image || '',
    })

    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      alert('Please enter the student name.')
      return
    }

    if (!form.course.trim()) {
      alert('Please enter the course name.')
      return
    }

    if (!form.review.trim()) {
      alert('Please enter the student review.')
      return
    }

    if (editingId !== null) {
      const updatedTestimonials = testimonials.map((testimonial) =>
        testimonial.id === editingId
          ? {
              ...testimonial,
              ...form,
            }
          : testimonial
      )

      saveTestimonials(updatedTestimonials)
    } else {
      const newTestimonial = {
        id: Date.now(),
        ...form,
        isActive: true,
      }

      saveTestimonials([
        newTestimonial,
        ...testimonials,
      ])
    }

    handleCancel()
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this testimonial?'
    )

    if (!confirmed) return

    const updatedTestimonials = testimonials.filter(
      (testimonial) => testimonial.id !== id
    )

    saveTestimonials(updatedTestimonials)

    if (editingId === id) {
      handleCancel()
    }
  }

  function handleToggleStatus(id) {
    const updatedTestimonials = testimonials.map(
      (testimonial) =>
        testimonial.id === id
          ? {
              ...testimonial,
              isActive: !testimonial.isActive,
            }
          : testimonial
    )

    saveTestimonials(updatedTestimonials)
  }

  function renderStars(rating) {
    return '★'.repeat(Number(rating) || 0) +
      '☆'.repeat(5 - (Number(rating) || 0))
  }

  return (
    <section className="testimonials-manager admin-module">
      <div className="testimonials-manager-header admin-module-header">
        <div>
          <span className="admin-section-eyebrow">
            Content Management
          </span>

          <h1>Testimonials</h1>

          <p>
            Manage student reviews and testimonials displayed on the
            academy website.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddForm}
          >
            + Add Testimonial
          </button>
        )}
      </div>

      {showForm && (
        <form
          ref={formRef}
          className="testimonials-form admin-form-card"
          onSubmit={handleSubmit}
        >
          <div className="testimonials-form-header admin-form-header">
            <div>
              <span className="admin-section-eyebrow">
                {editingId !== null
                  ? 'Edit Content'
                  : 'New Content'}
              </span>

              <h2>
                {editingId !== null
                  ? 'Edit Testimonial'
                  : 'Add Testimonial'}
              </h2>
            </div>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          <div className="testimonials-form-section admin-form-section">
            <h3 className="admin-form-section-title">
              Student Information
            </h3>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="testimonial-name">
                  Student Name
                </label>

                <input
                  id="testimonial-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Rahul Kumar"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="testimonial-course">
                  Course
                </label>

                <input
                  id="testimonial-course"
                  name="course"
                  type="text"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="Example: Python Full Stack"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="testimonial-rating">
                  Rating
                </label>

                <select
                  id="testimonial-rating"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="admin-field admin-field-full">
                <label htmlFor="testimonial-review">
                  Student Review
                </label>

                <textarea
                  id="testimonial-review"
                  name="review"
                  rows="5"
                  value={form.review}
                  onChange={handleChange}
                  placeholder="Enter the student's testimonial..."
                />
              </div>
            </div>
          </div>

          <div className="testimonials-form-section admin-form-section">
            <h3 className="admin-form-section-title">
              Student Photo
            </h3>

            <div className="testimonial-media-editor">
              <div className="admin-field">
                <label htmlFor="testimonial-image">
                  Student Photo
                </label>

                <input
                  ref={imageInputRef}
                  id="testimonial-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <span className="admin-form-help">
                  JPG, PNG or WebP recommended.
                </span>
              </div>

              {form.image && (
                <div className="testimonial-image-preview">
                  <img
                    src={form.image}
                    alt="Student preview"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="testimonials-form-actions admin-form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
            >
              {editingId !== null
                ? 'Update Testimonial'
                : 'Save Testimonial'}
            </button>
          </div>
        </form>
      )}

      <div className="testimonials-list-section">
        <div className="testimonials-list-header admin-list-header">
          <div>
            <h2>Testimonials</h2>

            <span className="admin-count">
              {testimonials.length}{' '}
              {testimonials.length === 1
                ? 'testimonial'
                : 'testimonials'}
            </span>
          </div>
        </div>

        {testimonials.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No testimonials yet</h3>

            <p>
              Add your first student testimonial to get started.
            </p>
          </div>
        ) : (
          <div className="testimonial-admin-list">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="testimonial-admin-card"
              >
                <div className="testimonial-admin-photo">
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

                <div className="testimonial-admin-content">
                  <div className="testimonial-admin-heading">
                    <div>
                      <span className="testimonial-course">
                        {testimonial.course}
                      </span>

                      <h3>{testimonial.name}</h3>
                    </div>

                    <span
                      className={
                        testimonial.isActive
                          ? 'admin-status active'
                          : 'admin-status inactive'
                      }
                    >
                      {testimonial.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>

                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>

                  <p>{testimonial.review}</p>

                  <div className="testimonial-admin-actions">
                    <button
                      type="button"
                      className="admin-action-button edit"
                      onClick={() =>
                        handleEdit(testimonial)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-action-button status"
                      onClick={() =>
                        handleToggleStatus(testimonial.id)
                      }
                    >
                      {testimonial.isActive
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>

                    <button
                      type="button"
                      className="admin-action-button delete"
                      onClick={() =>
                        handleDelete(testimonial.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsManager