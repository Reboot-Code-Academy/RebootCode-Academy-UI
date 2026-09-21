import { useEffect, useMemo, useState } from 'react'

const BOOKINGS_KEY = 'reboot-code-academy-demo-bookings'
const STUDENTS_KEY = 'reboot-code-academy-students'
const COURSES_KEY = 'reboot-code-academy-courses'

const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Scheduled',
  'Completed',
  'Cancelled',
]

function DemoBookingsManager() {
  const [bookings, setBookings] = useState([])
  const [courses, setCourses] = useState([])

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All Courses')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const [showForm, setShowForm] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [viewingBooking, setViewingBooking] = useState(null)

  const [convertingBooking, setConvertingBooking] = useState(null)
  const [studentForm, setStudentForm] = useState(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    status: 'New',
    adminNotes: '',
  })

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  useEffect(() => {
    loadBookings()
    loadCourses()
  }, [])

  function loadBookings() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(BOOKINGS_KEY) || '[]'
      )

      setBookings(Array.isArray(stored) ? stored : [])
    } catch {
      setBookings([])
    }
  }

  function loadCourses() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(COURSES_KEY) || '[]'
      )

      const activeCourses = Array.isArray(stored)
        ? stored.filter((course) => course.isActive !== false)
        : []

      setCourses(activeCourses)
    } catch {
      setCourses([])
    }
  }

  function saveBookings(nextBookings) {
    setBookings(nextBookings)
    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify(nextBookings)
    )
  }

  // --------------------------------------------------
  // COURSE LIST
  // --------------------------------------------------

  const courseNames = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.name)
          .filter(Boolean)
      ),
    ]
  }, [courses])

  // --------------------------------------------------
  // FILTERED BOOKINGS
  // --------------------------------------------------

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.name?.toLowerCase().includes(query) ||
        booking.phone?.toLowerCase().includes(query) ||
        booking.email?.toLowerCase().includes(query)

      const matchesCourse =
        courseFilter === 'All Courses' ||
        booking.course === courseFilter

      const matchesStatus =
        statusFilter === 'All Status' ||
        booking.status === statusFilter

      return (
        matchesSearch &&
        matchesCourse &&
        matchesStatus
      )
    })
  }, [
    bookings,
    search,
    courseFilter,
    statusFilter,
  ])

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      new: bookings.filter(
        (item) => item.status === 'New'
      ).length,
      scheduled: bookings.filter(
        (item) => item.status === 'Scheduled'
      ).length,
      completed: bookings.filter(
        (item) => item.status === 'Completed'
      ).length,
      cancelled: bookings.filter(
        (item) => item.status === 'Cancelled'
      ).length,
    }
  }, [bookings])

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  function resetForm() {
    setForm({
      name: '',
      phone: '',
      email: '',
      course: '',
      preferredDate: '',
      preferredTime: '',
      message: '',
      status: 'New',
      adminNotes: '',
    })

    setEditingBooking(null)
  }

  function openAddBooking() {
    resetForm()
    setShowForm(true)
  }

  function openEditBooking(booking) {
    setEditingBooking(booking)

    setForm({
      name: booking.name || '',
      phone: booking.phone || '',
      email: booking.email || '',
      course: booking.course || '',
      preferredDate: booking.preferredDate || '',
      preferredTime: booking.preferredTime || '',
      message: booking.message || '',
      status: booking.status || 'New',
      adminNotes: booking.adminNotes || '',
    })

    setShowForm(true)
  }

  function handleFormChange(event) {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function saveBooking(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      alert('Please enter student/visitor name.')
      return
    }

    if (!form.phone.trim()) {
      alert('Please enter phone number.')
      return
    }

    if (!form.course) {
      alert('Please select a course.')
      return
    }

    const now = new Date().toISOString()

    if (editingBooking) {
      const updated = bookings.map((booking) =>
        booking.id === editingBooking.id
          ? {
              ...booking,
              ...form,
              updatedAt: now,
            }
          : booking
      )

      saveBookings(updated)
    } else {
      const newBooking = {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(),

        ...form,

        createdAt: now,
        updatedAt: now,

        convertedToStudentId: '',
        convertedAt: '',
      }

      saveBookings([
        newBooking,
        ...bookings,
      ])
    }

    setShowForm(false)
    resetForm()
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  function deleteBooking(booking) {
    const confirmed = window.confirm(
      `Delete demo booking for ${booking.name}?`
    )

    if (!confirmed) return

    const updated = bookings.filter(
      (item) => item.id !== booking.id
    )

    saveBookings(updated)
  }

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  function changeStatus(booking, status) {
    const updated = bookings.map((item) =>
      item.id === booking.id
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
        : item
    )

    saveBookings(updated)
  }

  // --------------------------------------------------
  // CONVERT TO STUDENT
  // --------------------------------------------------

  function openConvertToStudent(booking) {
    setConvertingBooking(booking)

    setStudentForm({
      name: booking.name || '',
      phone: booking.phone || '',
      email: booking.email || '',
      course: booking.course || '',
      joinDate:
        booking.preferredDate ||
        new Date().toISOString().split('T')[0],
      status: 'Active',
    })
  }

  function handleStudentFormChange(event) {
    const { name, value } = event.target

    setStudentForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function getNextStudentId(students) {
    let highestNumber = 1000

    students.forEach((student) => {
      const match = String(student.id || '').match(
        /^RCA(\d+)$/
      )

      if (match) {
        highestNumber = Math.max(
          highestNumber,
          Number(match[1])
        )
      }
    })

    return `RCA${highestNumber + 1}`
  }

  function getNextStudentIdPreview() {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STUDENTS_KEY) || '[]'
      )

      const students = Array.isArray(stored) ? stored : []

      return getNextStudentId(students)
    } catch {
      return 'RCA1001'
    }
  }

  function convertToStudent(event) {
    event.preventDefault()

    if (!convertingBooking || !studentForm) return

    if (convertingBooking.convertedToStudentId) {
      alert(
        `This booking has already been converted to ${convertingBooking.convertedToStudentId}.`
      )
      return
    }

    if (!studentForm.name.trim()) {
      alert('Please enter student name.')
      return
    }

    if (!studentForm.phone.trim()) {
      alert('Please enter phone number.')
      return
    }

    if (!studentForm.course) {
      alert('Please select course.')
      return
    }

    let students = []

    try {
      const stored = JSON.parse(
        localStorage.getItem(STUDENTS_KEY) || '[]'
      )

      students = Array.isArray(stored) ? stored : []
    } catch {
      students = []
    }

    const phoneExists = students.some(
      (student) =>
        String(student.phone || '').trim() ===
        String(studentForm.phone || '').trim()
    )

    if (phoneExists) {
      alert(
        'A student with this phone number already exists.'
      )
      return
    }

    if (studentForm.email.trim()) {
      const emailExists = students.some(
        (student) =>
          String(student.email || '')
            .trim()
            .toLowerCase() ===
          studentForm.email.trim().toLowerCase()
      )

      if (emailExists) {
        alert(
          'A student with this email already exists.'
        )
        return
      }
    }

    const studentId = getNextStudentId(students)

    const newStudent = {
      id: studentId,
      name: studentForm.name.trim(),
      phone: studentForm.phone.trim(),
      email: studentForm.email.trim(),
      course: studentForm.course,
      joinDate: studentForm.joinDate,
      status: studentForm.status,
      photo: '',
      createdAt: new Date().toISOString(),
      source: 'Demo Booking',
      demoBookingId: convertingBooking.id,
    }

    localStorage.setItem(
      STUDENTS_KEY,
      JSON.stringify([
        ...students,
        newStudent,
      ])
    )

    const updatedBookings = bookings.map(
      (booking) =>
        booking.id === convertingBooking.id
          ? {
              ...booking,
              convertedToStudentId: studentId,
              convertedAt:
                new Date().toISOString(),
              status: 'Completed',
              updatedAt:
                new Date().toISOString(),
            }
          : booking
    )

    saveBookings(updatedBookings)

    setConvertingBooking(null)
    setStudentForm(null)

    alert(
      `Student created successfully.\nStudent ID: ${studentId}`
    )
  }

  // --------------------------------------------------
  // DATE FORMAT
  // --------------------------------------------------

  function formatDate(date) {
    if (!date) return '-'

    const value = new Date(date)

    if (Number.isNaN(value.getTime())) {
      return date
    }

    return value.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  function formatDateTime(date) {
    if (!date) return '-'

    const value = new Date(date)

    if (Number.isNaN(value.getTime())) {
      return date
    }

    return value.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <section className="demo-bookings-page">

      <div className="students-page-header">
        <div>
          <span className="students-page-eyebrow">
            ACADEMY
          </span>

          <h1>Demo Bookings</h1>

          <p>
            Manage demo class requests and convert
            confirmed learners into students.
          </p>
        </div>

        <button
          className="students-primary-btn"
          onClick={openAddBooking}
        >
          + Add Demo Booking
        </button>
      </div>

      {/* STATISTICS */}

      <div className="demo-booking-stats">

        <div className="demo-stat-card">
          <span>Total Bookings</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="demo-stat-card">
          <span>New</span>
          <strong>{stats.new}</strong>
        </div>

        <div className="demo-stat-card">
          <span>Scheduled</span>
          <strong>{stats.scheduled}</strong>
        </div>

        <div className="demo-stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </div>

        <div className="demo-stat-card">
          <span>Cancelled</span>
          <strong>{stats.cancelled}</strong>
        </div>

      </div>

      {/* FILTERS */}

      <div className="demo-booking-filters">

        <div className="students-search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search name, phone or email..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(event.target.value)
          }
        >
          <option>All Courses</option>

          {courseNames.map((course) => (
            <option
              key={course}
              value={course}
            >
              {course}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option>All Status</option>

          {STATUS_OPTIONS.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>

      </div>

      {/* TABLE */}

      <div className="students-table-card">

        <div className="students-table-wrapper">

          <table className="students-table">

            <thead>
              <tr>
                <th>Visitor</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Preferred Date</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredBookings.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="students-empty-state"
                  >
                    <div>
                      <strong>
                        No demo bookings found
                      </strong>

                      <p>
                        Demo bookings will appear here
                        once they are added.
                      </p>
                    </div>
                  </td>
                </tr>

              ) : (

                filteredBookings.map((booking) => (

                  <tr key={booking.id}>

                    <td>
                      <div className="demo-booking-person">
                        <div className="demo-booking-avatar">
                          {booking.name
                            ?.charAt(0)
                            ?.toUpperCase() || '?'}
                        </div>

                        <div>
                          <strong>
                            {booking.name}
                          </strong>

                          {booking.email && (
                            <small>
                              {booking.email}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{booking.phone}</td>

                    <td>
                      {booking.course}
                    </td>

                    <td>
                      {formatDate(
                        booking.preferredDate
                      )}

                      {booking.preferredTime && (
                        <small className="demo-time">
                          {booking.preferredTime}
                        </small>
                      )}
                    </td>

                    <td>
                      <select
                        className={`demo-status-select status-${booking.status
                          ?.toLowerCase()
                          .replace(/\s+/g, '-')}`}
                        value={booking.status}
                        onChange={(event) =>
                          changeStatus(
                            booking,
                            event.target.value
                          )
                        }
                      >
                        {STATUS_OPTIONS.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </td>

                    <td>
                      {formatDate(
                        booking.createdAt
                      )}
                    </td>

                    <td>
                      <div className="students-action-buttons">

                        <button
                          className="students-action-btn"
                          title="View"
                          onClick={() =>
                            setViewingBooking(
                              booking
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          className="students-action-btn"
                          title="Edit"
                          onClick={() =>
                            openEditBooking(
                              booking
                            )
                          }
                        >
                          Edit
                        </button>

                        {!booking.convertedToStudentId ? (
                          <button
                            className="students-action-btn students-convert-btn"
                            onClick={() =>
                              openConvertToStudent(
                                booking
                              )
                            }
                          >
                            Convert
                          </button>
                        ) : (
                          <span className="demo-converted-label">
                            {booking.convertedToStudentId}
                          </span>
                        )}

                        <button
                          className="students-action-btn students-delete-btn"
                          title="Delete"
                          onClick={() =>
                            deleteBooking(
                              booking
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        <div className="demo-booking-footer">
          Showing {filteredBookings.length} of{' '}
          {bookings.length} bookings
        </div>

      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div
          className="students-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setShowForm(false)
            }
          }}
        >
          <div className="students-modal">

            <div className="students-modal-header">
              <div>
                <h2>
                  {editingBooking
                    ? 'Edit Demo Booking'
                    : 'Add Demo Booking'}
                </h2>

                <p>
                  Enter the visitor's demo booking
                  details.
                </p>
              </div>

              <button
                className="students-modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>
            </div>

            <form
              className="students-form"
              onSubmit={saveBooking}
            >

              <div className="students-form-grid">

                <div className="students-form-field">
                  <label>
                    Student / Visitor Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter name"
                  />
                </div>

                <div className="students-form-field">
                  <label>
                    Phone *
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="students-form-field">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="students-form-field">
                  <label>
                    Interested Course *
                  </label>

                  <select
                    name="course"
                    value={form.course}
                    onChange={handleFormChange}
                  >
                    <option value="">
                      Select course
                    </option>

                    {courseNames.map(
                      (course) => (
                        <option
                          key={course}
                          value={course}
                        >
                          {course}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="students-form-field">
                  <label>
                    Preferred Date
                  </label>

                  <input
                    type="date"
                    name="preferredDate"
                    value={
                      form.preferredDate
                    }
                    onChange={handleFormChange}
                  />
                </div>

                <div className="students-form-field">
                  <label>
                    Preferred Time
                  </label>

                  <input
                    type="time"
                    name="preferredTime"
                    value={
                      form.preferredTime
                    }
                    onChange={handleFormChange}
                  />
                </div>

                <div className="students-form-field">
                  <label>
                    Booking Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {STATUS_OPTIONS.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="students-form-field students-full-width">
                  <label>
                    Visitor Message
                  </label>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleFormChange}
                    rows="4"
                    placeholder="Message or requirements..."
                  />
                </div>

                <div className="students-form-field students-full-width">
                  <label>
                    Admin Notes
                  </label>

                  <textarea
                    name="adminNotes"
                    value={form.adminNotes}
                    onChange={handleFormChange}
                    rows="4"
                    placeholder="Internal admin notes..."
                  />
                </div>

              </div>

              <div className="students-modal-actions">

                <button
                  type="button"
                  className="students-secondary-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="students-primary-btn"
                >
                  {editingBooking
                    ? 'Update Booking'
                    : 'Save Booking'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* VIEW MODAL */}

      {viewingBooking && (
        <div
          className="students-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setViewingBooking(null)
            }
          }}
        >
          <div className="students-modal demo-view-modal">

            <div className="students-modal-header">

              <div>
                <span className="students-page-eyebrow">
                  DEMO BOOKING
                </span>

                <h2>
                  {viewingBooking.name}
                </h2>
              </div>

              <button
                className="students-modal-close"
                onClick={() =>
                  setViewingBooking(null)
                }
              >
                ×
              </button>

            </div>

            <div className="demo-booking-details">

              <div>
                <span>Phone</span>
                <strong>
                  {viewingBooking.phone ||
                    '-'}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {viewingBooking.email ||
                    '-'}
                </strong>
              </div>

              <div>
                <span>Course</span>
                <strong>
                  {viewingBooking.course ||
                    '-'}
                </strong>
              </div>

              <div>
                <span>Preferred Date</span>
                <strong>
                  {formatDate(
                    viewingBooking.preferredDate
                  )}
                </strong>
              </div>

              <div>
                <span>Preferred Time</span>
                <strong>
                  {viewingBooking.preferredTime ||
                    '-'}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {viewingBooking.status}
                </strong>
              </div>

              <div>
                <span>Created</span>
                <strong>
                  {formatDateTime(
                    viewingBooking.createdAt
                  )}
                </strong>
              </div>

              <div className="demo-detail-full">
                <span>Visitor Message</span>
                <p>
                  {viewingBooking.message ||
                    'No message provided.'}
                </p>
              </div>

              <div className="demo-detail-full">
                <span>Admin Notes</span>
                <p>
                  {viewingBooking.adminNotes ||
                    'No admin notes.'}
                </p>
              </div>

              {viewingBooking.convertedToStudentId && (
                <div className="demo-converted-box">
                  Converted to student:{' '}
                  <strong>
                    {
                      viewingBooking.convertedToStudentId
                    }
                  </strong>
                </div>
              )}

            </div>

            <div className="students-modal-actions">

              <button
                className="students-secondary-btn"
                onClick={() =>
                  setViewingBooking(null)
                }
              >
                Close
              </button>

              {!viewingBooking.convertedToStudentId && (
                <button
                  className="students-primary-btn"
                  onClick={() => {
                    setViewingBooking(null)
                    openConvertToStudent(
                      viewingBooking
                    )
                  }}
                >
                  Convert to Student
                </button>
              )}

            </div>

          </div>
        </div>
      )}

      {/* CONVERT TO STUDENT MODAL */}

      {convertingBooking &&
        studentForm && (
          <div className="students-modal-overlay">

            <div className="students-modal">

              <div className="students-modal-header">

                <div>
                  <span className="students-page-eyebrow">
                    CONVERT
                  </span>

                  <h2>
                    Convert to Student
                  </h2>

                  <p>
                    Review the details before
                    creating the student record.
                  </p>
                </div>

                <button
                  className="students-modal-close"
                  onClick={() => {
                    setConvertingBooking(null)
                    setStudentForm(null)
                  }}
                >
                  ×
                </button>

              </div>

              <form
                className="students-form"
                onSubmit={convertToStudent}
              >

                <div className="demo-convert-info">
                  Student ID will be generated automatically:
                  <strong>{getNextStudentIdPreview()}</strong>
                </div>

                <div className="students-form-grid">

                  <div className="students-form-field">
                    <label>
                      Student Name *
                    </label>

                    <input
                      name="name"
                      value={
                        studentForm.name
                      }
                      onChange={
                        handleStudentFormChange
                      }
                    />
                  </div>

                  <div className="students-form-field">
                    <label>
                      Phone *
                    </label>

                    <input
                      name="phone"
                      value={
                        studentForm.phone
                      }
                      onChange={
                        handleStudentFormChange
                      }
                    />
                  </div>

                  <div className="students-form-field">
                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      value={
                        studentForm.email
                      }
                      onChange={
                        handleStudentFormChange
                      }
                    />
                  </div>

                  <div className="students-form-field">
                    <label>
                      Course *
                    </label>

                    <select
                      name="course"
                      value={
                        studentForm.course
                      }
                      onChange={
                        handleStudentFormChange
                      }
                    >
                      <option value="">
                        Select course
                      </option>

                      {courseNames.map(
                        (course) => (
                          <option
                            key={course}
                            value={course}
                          >
                            {course}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="students-form-field">
                    <label>
                      Joining Date
                    </label>

                    <input
                      type="date"
                      name="joinDate"
                      value={
                        studentForm.joinDate
                      }
                      onChange={
                        handleStudentFormChange
                      }
                    />
                  </div>

                  <div className="students-form-field">
                    <label>
                      Student Status
                    </label>

                    <select
                      name="status"
                      value={
                        studentForm.status
                      }
                      onChange={
                        handleStudentFormChange
                      }
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>
                    </select>
                  </div>

                </div>

                <div className="students-modal-actions">

                  <button
                    type="button"
                    className="students-secondary-btn"
                    onClick={() => {
                      setConvertingBooking(null)
                      setStudentForm(null)
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="students-primary-btn"
                  >
                    Create Student
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

    </section>
  )
}

export default DemoBookingsManager