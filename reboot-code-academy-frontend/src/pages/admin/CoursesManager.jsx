import { useEffect, useRef, useState } from 'react'
import Section from '../../components/Section.jsx'

const STORAGE_KEY = 'reboot-code-academy-courses'

const defaultCourses = [
  {
    id: 1,
    name: 'Python Full Stack',
    description:
      'Learn Python, Django, databases, frontend development, and build real-world projects.',
    level: 'Beginner to Advanced',
    duration: '6 Months',
    topics: ['Python', 'Django', 'HTML', 'CSS', 'JavaScript'],
    image: '',
    isActive: true,
  },
  {
    id: 2,
    name: 'Java Full Stack',
    description:
      'Build full-stack applications using Java, Spring Boot, databases, and modern frontend technologies.',
    level: 'Beginner to Advanced',
    duration: '6 Months',
    topics: ['Java', 'Spring Boot', 'MySQL', 'HTML', 'JavaScript'],
    image: '',
    isActive: true,
  },
]

const emptyForm = {
  name: '',
  description: '',
  level: '',
  duration: '',
  topics: '',
  image: '',
}

function CoursesManager() {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const formRef = useRef(null)

  useEffect(() => {
    const savedCourses = localStorage.getItem(STORAGE_KEY)

    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses))
      } catch (error) {
        console.error('Could not read courses:', error)
        setCourses(defaultCourses)
      }
    } else {
      setCourses(defaultCourses)

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultCourses)
      )
    }
  }, [])

  function saveCourses(updatedCourses) {
    setCourses(updatedCourses)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedCourses)
    )
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setForm((currentForm) => ({
        ...currentForm,
        image: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  function handleSubmit(event) {
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

    if (editingId !== null) {
      const updatedCourses = courses.map((course) =>
        course.id === editingId
          ? {
              ...course,
              name: form.name.trim(),
              description: form.description.trim(),
              level: form.level.trim(),
              duration: form.duration.trim(),
              topics,
              image: form.image,
            }
          : course
      )

      saveCourses(updatedCourses)
    } else {
      const newCourse = {
        id: Date.now(),
        name: form.name.trim(),
        description: form.description.trim(),
        level: form.level.trim(),
        duration: form.duration.trim(),
        topics,
        image: form.image,
        isActive: true,
      }

      saveCourses([...courses, newCourse])
    }

    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function handleAddCourse() {
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

  function handleEdit(course) {
    setEditingId(course.id)

    setForm({
      name: course.name || '',
      description: course.description || '',
      level: course.level || '',
      duration: course.duration || '',
      topics: course.topics?.join(', ') || '',
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

  function handleDelete(id) {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this course?'
    )

    if (!shouldDelete) {
      return
    }

    const updatedCourses = courses.filter(
      (course) => course.id !== id
    )

    saveCourses(updatedCourses)

    if (editingId === id) {
      setEditingId(null)
      setForm(emptyForm)
      setShowForm(false)
    }
  }

  function handleToggleStatus(id) {
    const updatedCourses = courses.map((course) =>
      course.id === id
        ? {
            ...course,
            isActive: !course.isActive,
          }
        : course
    )

    saveCourses(updatedCourses)
  }

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(false)
  }

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
            <h3>Course Management</h3>

            <p>
              Add courses, update course information, manage images,
              and control which courses are visible on the website.
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
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* BASIC INFORMATION */}

              <div className="course-form-section">

                <div className="course-form-section-title">
                  <strong>Basic Information</strong>
                  <span>
                    Course details shown to visitors
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
                    />
                  </label>

                  <label>
                    Level
                    <select
                      name="level"
                      value={form.level}
                      onChange={handleChange}
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
                    />

                    <small className="form-help">
                      Separate topics using commas.
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
                    />
                  </label>

                </div>

              </div>

              {/* COURSE IMAGE */}

              <div className="course-form-section">

                <div className="course-form-section-title">
                  <strong>Course Media</strong>
                  <span>
                    Upload an image for this course
                  </span>
                </div>

                <div className="course-media-editor">

                  <div className="course-image-upload">

                    <label>
                      Course Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>

                    <small className="form-help">
                      Recommended: JPG, PNG or WebP.
                    </small>

                  </div>

                  {form.image && (
                    <div className="course-image-preview">

                      <span>Image Preview</span>

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
                >
                  {editingId !== null
                    ? 'Update Course'
                    : 'Create Course'}
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleCancel}
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
              <h3>Existing Courses</h3>

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

          {courses.length === 0 ? (
            <div className="announcement-empty">
              <p>No courses created yet.</p>

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
                        <span>No Image</span>
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="course-admin-content">

                    <div className="course-admin-title-row">

                      <h3>{course.name}</h3>

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
                        <strong>Level:</strong>{' '}
                        {course.level}
                      </span>

                      <span>
                        <strong>Duration:</strong>{' '}
                        {course.duration}
                      </span>

                    </div>

                    {course.topics?.length > 0 && (
                      <div className="course-admin-topics">

                        {course.topics.map((topic) => (
                          <span key={topic}>
                            {topic}
                          </span>
                        ))}

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
                        handleToggleStatus(course.id)
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
                        handleDelete(course.id)
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