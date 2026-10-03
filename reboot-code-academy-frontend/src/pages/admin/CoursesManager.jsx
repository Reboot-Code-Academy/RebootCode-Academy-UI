import { useEffect, useRef, useState } from 'react'
import Section from '../../components/Section.jsx'
import { api } from '../../services/api.js'

const emptyForm = {
  name: '',
  description: '',
  level: '',
  duration: '',
  topics: '',
  image: '',
}

function formatCourse(course) {
  return {
    id: course.id,
    name: course.name || '',
    description: course.description || '',
    level: course.level || '',
    duration: course.duration || '',
    topics: course.topics
      ? course.topics
          .split(',')
          .map((topic) => topic.trim())
          .filter(Boolean)
      : [],
    image: course.image_url || '',
    isActive: course.is_active,
  }
}

function CoursesManager() {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [selectedImageFile, setSelectedImageFile] =
    useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const formRef = useRef(null)

  // =========================================
  // LOAD COURSES
  // =========================================

  async function loadCourses() {
    try {
      setLoading(true)
      setError('')

      const data = await api.get('/courses')

      const formattedCourses =
        data.map(formatCourse)

      setCourses(formattedCourses)
    } catch (error) {
      console.error(
        'Could not load courses:',
        error
      )

      setError(
        error.message ||
          'Could not load courses from the server.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  // =========================================
  // FORM CHANGE
  // =========================================

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  // =========================================
  // IMAGE SELECT
  // =========================================

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      event.target.value = ''
      return
    }

    // Optional frontend size validation: 5 MB
    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      alert('Please select an image smaller than 5 MB.')
      event.target.value = ''
      return
    }

    setSelectedImageFile(file)

    // Browser preview only.
    const previewUrl =
      URL.createObjectURL(file)

    setForm((currentForm) => ({
      ...currentForm,
      image: previewUrl,
    }))
  }

  // =========================================
  // RESET FORM
  // =========================================

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setSelectedImageFile(null)
  }

  // =========================================
  // CREATE / UPDATE COURSE
  // =========================================

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      alert('Please enter the course name.')
      return
    }

    if (!form.description.trim()) {
      alert('Please enter the course description.')
      return
    }

    if (!form.level.trim()) {
      alert('Please select the course level.')
      return
    }

    if (!form.duration.trim()) {
      alert('Please enter the course duration.')
      return
    }

    const topics = form.topics
      .split(',')
      .map((topic) => topic.trim())
      .filter(Boolean)

    try {
      setSaving(true)
      setError('')

      let course

      // =========================================
      // UPDATE EXISTING COURSE
      // =========================================

      if (editingId !== null) {
        const updatedCourse =
          await api.put(
            `/courses/${editingId}`,
            {
              name: form.name.trim(),
              description:
                form.description.trim(),
              level: form.level.trim(),
              duration:
                form.duration.trim(),
              topics: topics.join(', '),
            }
          )

        course = updatedCourse

        // Upload new image only if selected
        if (selectedImageFile) {
          const formData = new FormData()

          formData.append(
            'file',
            selectedImageFile
          )

          await api.upload(
            `/courses/${editingId}/image`,
            formData
          )
        }
      }

      // =========================================
      // CREATE NEW COURSE
      // =========================================

      else {
        const newCourse =
          await api.post(
            '/courses',
            {
              name: form.name.trim(),
              description:
                form.description.trim(),
              level: form.level.trim(),
              duration:
                form.duration.trim(),
              topics: topics.join(', '),
              image_url: null,
              is_active: true,
            }
          )

        course = newCourse

        // Upload image after course exists
        if (selectedImageFile) {
          const formData = new FormData()

          formData.append(
            'file',
            selectedImageFile
          )

          await api.upload(
            `/courses/${course.id}/image`,
            formData
          )
        }
      }

      // Reload from backend.
      // This gets the actual Supabase Storage URL.
      await loadCourses()

      resetForm()
      setShowForm(false)

      alert(
        editingId !== null
          ? 'Course updated successfully.'
          : 'Course created successfully.'
      )
    } catch (error) {
      console.error(
        'Course save error:',
        error
      )

      setError(
        error.message ||
          'Could not save the course.'
      )

      alert(
        error.message ||
          'Could not save the course.'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================================
  // ADD COURSE
  // =========================================

  function handleAddCourse() {
    resetForm()
    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  // =========================================
  // EDIT COURSE
  // =========================================

  function handleEdit(course) {
    setEditingId(course.id)

    setSelectedImageFile(null)

    setForm({
      name: course.name || '',
      description: course.description || '',
      level: course.level || '',
      duration: course.duration || '',
      topics:
        course.topics?.join(', ') || '',
      image: course.image || '',
    })

    setShowForm(true)

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  // =========================================
  // DELETE COURSE
  // =========================================

  async function handleDelete(id) {
    const shouldDelete =
      window.confirm(
        'Are you sure you want to delete this course?'
      )

    if (!shouldDelete) {
      return
    }

    try {
      setError('')

      await api.delete(
        `/courses/${id}`
      )

      await loadCourses()

      if (editingId === id) {
        resetForm()
        setShowForm(false)
      }

      alert(
        'Course deleted successfully.'
      )
    } catch (error) {
      console.error(
        'Course delete error:',
        error
      )

      setError(
        error.message ||
          'Could not delete the course.'
      )

      alert(
        error.message ||
          'Could not delete the course.'
      )
    }
  }

  // =========================================
  // ACTIVE / INACTIVE
  // =========================================

  async function handleToggleStatus(course) {
    try {
      setError('')

      await api.put(
        `/courses/${course.id}`,
        {
          is_active:
            !course.isActive,
        }
      )

      await loadCourses()
    } catch (error) {
      console.error(
        'Course status update error:',
        error
      )

      setError(
        error.message ||
          'Could not update course status.'
      )

      alert(
        error.message ||
          'Could not update course status.'
      )
    }
  }

  // =========================================
  // CANCEL
  // =========================================

  function handleCancel() {
    resetForm()
    setShowForm(false)
  }

  // =========================================
  // UI
  // =========================================

  return (
    <Section
      description="Create and manage the courses displayed on the public website."
      eyebrow="Content Management"
      title="Courses"
    >
      <div className="course-admin">

        {/* PAGE HEADER */}

        <div className="course-manager-header">
          <div>
            <h3>
              Course Management
            </h3>

            <p>
              Add courses, update course
              information, manage images,
              and control which courses
              are visible on the website.
            </p>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={handleAddCourse}
          >
            + Add Course
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="announcement-empty">
            <p>{error}</p>

            <button
              type="button"
              className="button button-secondary"
              onClick={loadCourses}
            >
              Try Again
            </button>
          </div>
        )}

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <div
            className="course-admin-form"
            ref={formRef}
          >
            <div className="course-form-header">

              <div>
                <span className="eyebrow">
                  {editingId !== null
                    ? 'Edit Course'
                    : 'New Course'}
                </span>

                <h3>
                  {editingId !== null
                    ? 'Update Course'
                    : 'Create Course'}
                </h3>
              </div>

              <button
                type="button"
                className="button button-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Close
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* BASIC INFORMATION */}

              <div className="course-form-section">

                <div className="course-form-section-title">

                  <strong>
                    Basic Information
                  </strong>

                  <span>
                    Course details shown to
                    visitors
                  </span>

                </div>

                <div className="form-grid">

                  <label>
                    Course Name

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Python Full Stack"
                      disabled={saving}
                    />
                  </label>

                  <label>
                    Level

                    <select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
                      disabled={saving}
                    >
                      <option value="">
                        Select Level
                      </option>

                      <option value="Beginner">
                        Beginner
                      </option>

                      <option value="Intermediate">
                        Intermediate
                      </option>

                      <option value="Advanced">
                        Advanced
                      </option>

                      <option value="Beginner to Advanced">
                        Beginner to Advanced
                      </option>
                    </select>
                  </label>

                  <label>
                    Duration

                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="6 Months"
                      disabled={saving}
                    />
                  </label>

                  <label>
                    Topics

                    <input
                      type="text"
                      name="topics"
                      value={form.topics}
                      onChange={handleChange}
                      placeholder="Python, Django, MySQL, HTML"
                      disabled={saving}
                    />

                    <small className="form-help">
                      Separate topics using
                      commas.
                    </small>
                  </label>

                  <label className="form-field-full">
                    Description

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the course..."
                      rows="5"
                      disabled={saving}
                    />
                  </label>

                </div>

              </div>

              {/* COURSE IMAGE */}

              <div className="course-form-section">

                <div className="course-form-section-title">

                  <strong>
                    Course Media
                  </strong>

                  <span>
                    Upload an image for
                    this course
                  </span>

                </div>

                <div className="course-media-editor">

                  <div className="course-image-upload">

                    <label>
                      Course Image

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={
                          handleImageChange
                        }
                        disabled={saving}
                      />
                    </label>

                    <small className="form-help">
                      Recommended: JPG,
                      PNG or WebP.
                      Maximum size: 5 MB.
                    </small>

                    {selectedImageFile && (
                      <small className="form-help">
                        Selected:{' '}
                        {
                          selectedImageFile.name
                        }
                      </small>
                    )}

                  </div>

                  {form.image && (
                    <div className="course-image-preview">

                      <span>
                        Image Preview
                      </span>

                      <img
                        src={form.image}
                        alt="Course preview"
                      />

                    </div>
                  )}

                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="course-form-actions">

                <button
                  type="submit"
                  className="button button-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingId !== null
                    ? 'Update Course'
                    : 'Create Course'}
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* EXISTING COURSES */}

        <div className="course-admin-list">

          <div className="course-list-header">

            <div>
              <h3>
                Existing Courses
              </h3>

              <p>
                {courses.length}{' '}
                {courses.length === 1
                  ? 'course'
                  : 'courses'}{' '}
                available.
              </p>
            </div>

            <span className="course-count">
              {courses.length}
            </span>

          </div>

          {loading ? (
            <div className="announcement-empty">
              <p>
                Loading courses...
              </p>
            </div>
          ) : courses.length === 0 ? (
            <div className="announcement-empty">

              <p>
                No courses created yet.
              </p>

              <button
                type="button"
                className="button button-primary"
                onClick={handleAddCourse}
              >
                Add First Course
              </button>

            </div>
          ) : (
            <div className="course-admin-grid">

              {courses.map((course) => (

                <article
                  className="course-admin-card"
                  key={course.id}
                >

                  {/* IMAGE */}

                  <div className="course-admin-media">

                    {course.image ? (
                      <img
                        className="course-admin-image"
                        src={course.image}
                        alt={course.name}
                      />
                    ) : (
                      <div className="course-admin-image-placeholder">
                        <span>
                          No Image
                        </span>
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="course-admin-content">

                    <div className="course-admin-title-row">

                      <h3>
                        {course.name}
                      </h3>

                      <span
                        className={
                          course.isActive
                            ? 'status-active'
                            : 'status-inactive'
                        }
                      >
                        {course.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                    </div>

                    <p>
                      {course.description}
                    </p>

                    <div className="course-admin-details">

                      <span>
                        <strong>
                          Level:
                        </strong>{' '}
                        {course.level}
                      </span>

                      <span>
                        <strong>
                          Duration:
                        </strong>{' '}
                        {course.duration}
                      </span>

                    </div>

                    {course.topics?.length >
                      0 && (
                      <div className="course-admin-topics">

                        {course.topics.map(
                          (topic) => (
                            <span key={topic}>
                              {topic}
                            </span>
                          )
                        )}

                      </div>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="course-admin-actions">

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() =>
                        handleEdit(course)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() =>
                        handleToggleStatus(
                          course
                        )
                      }
                    >
                      {course.isActive
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>

                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() =>
                        handleDelete(
                          course.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>
          )}

        </div>

      </div>
    </Section>
  )
}

export default CoursesManager