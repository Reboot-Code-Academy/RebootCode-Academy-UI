import { useEffect, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'

const STUDENTS_KEY = 'reboot-code-academy-students'
const COURSES_KEY = 'reboot-code-academy-courses'

const ID_PREFIX = 'RCA'
const ID_START = 1001

const EMPTY_FORM = {
  id: '',
  name: '',
  email: '',
  phone: '',
  course: '',
  joinDate: '',
  status: 'Active',
  image: '',
}

function StudentsManager() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])

  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(false)

  const [selectedStudent, setSelectedStudent] = useState(null)

  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('All Courses')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const [showImport, setShowImport] = useState(false)
  const [importRows, setImportRows] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const [importFileName, setImportFileName] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    loadStudents()
    loadCourses()
  }, [])

  function loadStudents() {
    const saved = localStorage.getItem(STUDENTS_KEY)

    if (!saved) {
      setStudents([])
      return
    }

    try {
      const parsed = JSON.parse(saved)

      if (!Array.isArray(parsed)) {
        setStudents([])
        return
      }

      /*
       * Remove old demo records from the previous version.
       * Real records are preserved.
       */
      const cleaned = parsed.filter((student) => {
        const oldRahul =
          student.id === 'RCA001' &&
          student.name === 'Rahul Kumar'

        const oldSneha =
          student.id === 'RCA002' &&
          student.name === 'Sneha Reddy'

        return !oldRahul && !oldSneha
      })

      setStudents(cleaned)

      if (cleaned.length !== parsed.length) {
        localStorage.setItem(
          STUDENTS_KEY,
          JSON.stringify(cleaned)
        )
      }
    } catch {
      setStudents([])
    }
  }

  function loadCourses() {
    const saved = localStorage.getItem(COURSES_KEY)

    if (!saved) {
      setCourses([])
      return
    }

    try {
      const parsed = JSON.parse(saved)
      setCourses(Array.isArray(parsed) ? parsed : [])
    } catch {
      setCourses([])
    }
  }

  function saveStudents(data) {
    setStudents(data)
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(data))
  }

  function getNextStudentId(data = students) {
    let highest = ID_START - 1

    data.forEach((student) => {
      const match = String(student.id || '').match(
        new RegExp(`^${ID_PREFIX}(\\d+)$`, 'i')
      )

      if (match) {
        const number = Number(match[1])

        if (number > highest) {
          highest = number
        }
      }
    })

    return `${ID_PREFIX}${highest + 1}`
  }

  const availableCourses = useMemo(() => {
    return courses
      .filter(
        (course) =>
          course &&
          course.name &&
          course.isActive !== false
      )
      .map((course) => course.name)
  }, [courses])

  const allCourseNames = useMemo(() => {
    return [...new Set(availableCourses)]
  }, [availableCourses])

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        !value ||
        String(student.name || '')
          .toLowerCase()
          .includes(value) ||
        String(student.id || '')
          .toLowerCase()
          .includes(value) ||
        String(student.phone || '')
          .toLowerCase()
          .includes(value) ||
        String(student.email || '')
          .toLowerCase()
          .includes(value)

      const matchesCourse =
        courseFilter === 'All Courses' ||
        student.course === courseFilter

      const matchesStatus =
        statusFilter === 'All Status' ||
        student.status === statusFilter

      return (
        matchesSearch &&
        matchesCourse &&
        matchesStatus
      )
    })
  }, [
    students,
    search,
    courseFilter,
    statusFilter,
  ])

  const totalStudents = students.length

  const activeStudents = students.filter(
    (student) => student.status === 'Active'
  ).length

  const inactiveStudents = students.filter(
    (student) => student.status === 'Inactive'
  ).length

  /* =========================================================
     MANUAL STUDENT
     ========================================================= */

  function openAddStudent() {
    setForm({
      ...EMPTY_FORM,
      id: getNextStudentId(),
      joinDate: new Date()
        .toISOString()
        .split('T')[0],
    })

    setEditing(false)
    setSelectedStudent(null)
    setShowForm(true)
  }

  function openEditStudent(student) {
    setForm({
      id: student.id || '',
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      course: student.course || '',
      joinDate: student.joinDate || '',
      status: student.status || 'Active',
      image: student.image || '',
    })

    setEditing(true)
    setSelectedStudent(null)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(false)
    setForm(EMPTY_FORM)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5 MB.')
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

  function removePhoto() {
    setForm((previous) => ({
      ...previous,
      image: '',
    }))
  }

  function saveStudent(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      alert('Student name is required.')
      return
    }

    if (!form.phone.trim()) {
      alert('Phone number is required.')
      return
    }

    if (!form.course) {
      alert('Please select a course.')
      return
    }

    if (!form.joinDate) {
      alert('Join date is required.')
      return
    }

    const duplicatePhone = students.some(
      (student) =>
        String(student.phone).trim() ===
          form.phone.trim() &&
        student.id !== form.id
    )

    if (duplicatePhone) {
      alert(
        'A student with this phone number already exists.'
      )
      return
    }

    const student = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    }

    if (editing) {
      saveStudents(
        students.map((item) =>
          item.id === form.id ? student : item
        )
      )
    } else {
      saveStudents([...students, student])
    }

    closeForm()
  }

  /* =========================================================
     STUDENT ACTIONS
     ========================================================= */

  function viewStudent(student) {
    setSelectedStudent(student)
    setShowForm(false)
  }

  function deleteStudent(student) {
    const confirmed = window.confirm(
      `Delete ${student.name} (${student.id})?`
    )

    if (!confirmed) return

    const updated = students.filter(
      (item) => item.id !== student.id
    )

    saveStudents(updated)

    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null)
    }
  }

  function toggleStatus(student) {
    const newStatus =
      student.status === 'Active'
        ? 'Inactive'
        : 'Active'

    const updated = students.map((item) =>
      item.id === student.id
        ? {
            ...item,
            status: newStatus,
          }
        : item
    )

    saveStudents(updated)

    if (selectedStudent?.id === student.id) {
      setSelectedStudent({
        ...student,
        status: newStatus,
      })
    }
  }

  function formatDate(date) {
    if (!date) return '-'

    const parsed = new Date(`${date}T00:00:00`)

    if (Number.isNaN(parsed.getTime())) {
      return date
    }

    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  /* =========================================================
     EXCEL TEMPLATE
     ========================================================= */

  function downloadTemplate() {
    const rows = [
      {
        'Student Name': '',
        Email: '',
        Phone: '',
        Course: '',
        'Join Date': '2026-09-21',
        Status: 'Active',
      },
    ]

    const worksheet =
      XLSX.utils.json_to_sheet(rows)

    worksheet['!cols'] = [
      { wch: 25 },
      { wch: 30 },
      { wch: 16 },
      { wch: 28 },
      { wch: 16 },
      { wch: 12 },
    ]

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Students'
    )

    XLSX.writeFile(
      workbook,
      'Reboot-Code-Academy-Students-Template.xlsx'
    )
  }

  /* =========================================================
     EXPORT STUDENTS
     ========================================================= */

  function exportStudents() {
    if (!students.length) {
      alert('There are no students to export.')
      return
    }

    const rows = students.map((student) => ({
      'Student ID': student.id,
      'Student Name': student.name,
      Email: student.email || '',
      Phone: student.phone || '',
      Course: student.course || '',
      'Join Date': student.joinDate || '',
      Status: student.status || 'Active',
    }))

    const worksheet =
      XLSX.utils.json_to_sheet(rows)

    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 30 },
      { wch: 16 },
      { wch: 28 },
      { wch: 16 },
      { wch: 12 },
    ]

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Students'
    )

    XLSX.writeFile(
      workbook,
      `Reboot-Code-Academy-Students-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    )
  }

  /* =========================================================
     EXCEL IMPORT
     ========================================================= */

  function convertExcelDate(value) {
    if (!value) return ''

    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value)

      if (!date) return ''

      return `${date.y}-${String(date.m).padStart(
        2,
        '0'
      )}-${String(date.d).padStart(2, '0')}`
    }

    const text = String(value).trim()

    if (!text) return ''

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return text
    }

    const parsed = new Date(text)

    if (Number.isNaN(parsed.getTime())) {
      return ''
    }

    return `${parsed.getFullYear()}-${String(
      parsed.getMonth() + 1
    ).padStart(2, '0')}-${String(
      parsed.getDate()
    ).padStart(2, '0')}`
  }

  function normalizeExcelRow(row) {
    return {
      name:
        row['Student Name'] ??
        row['Name'] ??
        '',

      email:
        row['Email'] ??
        '',

      phone:
        row['Phone'] ??
        row['Mobile'] ??
        '',

      course:
        row['Course'] ??
        '',

      joinDate: convertExcelDate(
        row['Join Date'] ??
          row['JoinDate'] ??
          row['joinDate']
      ),

      status:
        row['Status'] ??
        'Active',
    }
  }

  function validateImport(rows) {
    const valid = []
    const errors = []

    const existingPhones = new Set(
      students.map((student) =>
        String(student.phone || '').trim()
      )
    )

    const existingEmails = new Set(
      students
        .map((student) =>
          String(student.email || '')
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    )

    const importedPhones = new Set()
    const importedEmails = new Set()

    const courseSet = new Set(
      availableCourses.map((course) =>
        course.trim().toLowerCase()
      )
    )

    rows.forEach((rawRow, index) => {
      const rowNumber = index + 2
      const row = normalizeExcelRow(rawRow)

      row.name = String(row.name).trim()
      row.email = String(row.email).trim()
      row.phone = String(row.phone).trim()
      row.course = String(row.course).trim()
      row.status = String(row.status).trim()

      const rowErrors = []

      if (!row.name) {
        rowErrors.push('Student Name is required')
      }

      if (!row.phone) {
        rowErrors.push('Phone is required')
      }

      if (!row.course) {
        rowErrors.push('Course is required')
      }

      if (!row.joinDate) {
        rowErrors.push('Valid Join Date is required')
      }

      if (
        row.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          row.email
        )
      ) {
        rowErrors.push('Invalid email')
      }

      if (
        row.course &&
        !courseSet.has(
          row.course.toLowerCase()
        )
      ) {
        rowErrors.push(
          `Course "${row.course}" does not exist`
        )
      }

      if (
        row.phone &&
        existingPhones.has(row.phone)
      ) {
        rowErrors.push(
          'Phone number already exists'
        )
      }

      if (
        row.phone &&
        importedPhones.has(row.phone)
      ) {
        rowErrors.push(
          'Duplicate phone in this file'
        )
      }

      if (
        row.email &&
        existingEmails.has(
          row.email.toLowerCase()
        )
      ) {
        rowErrors.push(
          'Email already exists'
        )
      }

      if (
        row.email &&
        importedEmails.has(
          row.email.toLowerCase()
        )
      ) {
        rowErrors.push(
          'Duplicate email in this file'
        )
      }

      if (
        row.status !== 'Active' &&
        row.status !== 'Inactive'
      ) {
        row.status = 'Active'
      }

      if (rowErrors.length) {
        errors.push({
          row: rowNumber,
          name: row.name || '-',
          messages: rowErrors,
        })
      } else {
        valid.push(row)

        importedPhones.add(row.phone)

        if (row.email) {
          importedEmails.add(
            row.email.toLowerCase()
          )
        }
      }
    })

    return {
      valid,
      errors,
    }
  }

  function handleBulkUpload(event) {
    const file = event.target.files?.[0]

    if (!file) return

    const extension = file.name
      .substring(file.name.lastIndexOf('.'))
      .toLowerCase()

    if (
      !['.xlsx', '.xls', '.csv'].includes(
        extension
      )
    ) {
      alert(
        'Please select an Excel or CSV file.'
      )

      event.target.value = ''
      return
    }

    setImportFileName(file.name)

    const reader = new FileReader()

    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(
          new Uint8Array(
            loadEvent.target.result
          ),
          {
            type: 'array',
          }
        )

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ]

        const rows = XLSX.utils.sheet_to_json(
          sheet,
          {
            defval: '',
          }
        )

        if (!rows.length) {
          alert(
            'No student records were found in the file.'
          )
          return
        }

        const result = validateImport(rows)

        setImportRows(result.valid)
        setImportErrors(result.errors)
        setShowImport(true)
      } catch (error) {
        console.error(error)

        alert(
          'Unable to read the file. Please use the downloaded template.'
        )
      }

      event.target.value = ''
    }

    reader.readAsArrayBuffer(file)
  }

  function importStudents() {
    if (!importRows.length) return

    let workingStudents = [...students]

    const newStudents = importRows.map((row) => {
      const student = {
        id: getNextStudentId(workingStudents),
        name: row.name,
        email: row.email,
        phone: row.phone,
        course: row.course,
        joinDate: row.joinDate,
        status: row.status,
        image: '',
      }

      workingStudents.push(student)

      return student
    })

    saveStudents(workingStudents)

    setShowImport(false)
    setImportRows([])
    setImportErrors([])
    setImportFileName('')

    alert(
      `${newStudents.length} student(s) imported successfully.`
    )
  }

  function closeImport() {
    setShowImport(false)
    setImportRows([])
    setImportErrors([])
    setImportFileName('')
  }

  return (
    <div className="students-admin">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="students-page-header">
        <div>
          <span className="admin-page-eyebrow">
            ACADEMY
          </span>

          <h1>Students</h1>

          <p>
            Manage enrolled students and their course
            details.
          </p>
        </div>

        <div className="students-header-actions">

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={exportStudents}
          >
            ↓ Export Students
          </button>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={downloadTemplate}
          >
            ↓ Download Template
          </button>

          <label className="admin-secondary-btn students-upload-btn">
            ↑ Bulk Upload

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleBulkUpload}
              hidden
            />
          </label>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={openAddStudent}
          >
            + Add Student
          </button>

        </div>
      </div>

      {/* =====================================================
          STATS
          ===================================================== */}

      <div className="students-stats-grid">

        <div className="students-stat-card">
          <div className="students-stat-icon">
            👥
          </div>

          <div>
            <span>Total Students</span>
            <strong>{totalStudents}</strong>
          </div>
        </div>

        <div className="students-stat-card">
          <div className="students-stat-icon">
            ✓
          </div>

          <div>
            <span>Active Students</span>
            <strong>{activeStudents}</strong>
          </div>
        </div>

        <div className="students-stat-card">
          <div className="students-stat-icon">
            ○
          </div>

          <div>
            <span>Inactive Students</span>
            <strong>{inactiveStudents}</strong>
          </div>
        </div>

      </div>

      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="students-filter-card">

        <div className="students-search-box">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search name, ID, phone or email..."
          />
        </div>

        <div className="students-filter-field">
          <label>Course</label>

          <select
            value={courseFilter}
            onChange={(event) =>
              setCourseFilter(event.target.value)
            }
          >
            <option>All Courses</option>

            {allCourseNames.map((course) => (
              <option
                key={course}
                value={course}
              >
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="students-filter-field">
          <label>Status</label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

      </div>

      {/* =====================================================
          ADD / EDIT FORM
          ===================================================== */}

      {showForm && (
        <div className="student-form-card">

          <div className="student-form-header">

            <div>
              <span className="admin-page-eyebrow">
                {editing
                  ? 'EDIT STUDENT'
                  : 'NEW STUDENT'}
              </span>

              <h2>
                {editing
                  ? 'Edit Student'
                  : 'Add New Student'}
              </h2>
            </div>

            <button
              type="button"
              className="student-close-btn"
              onClick={closeForm}
            >
              ×
            </button>

          </div>

          <form onSubmit={saveStudent}>

            <div className="student-form-content">

              {/* PHOTO */}

              <div className="student-photo-area">

                <div className="student-photo-preview">

                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Student"
                    />
                  ) : (
                    <span>👤</span>
                  )}

                </div>

                <label className="photo-upload-button">
                  Upload Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </label>

                {form.image && (
                  <button
                    type="button"
                    className="remove-photo-button"
                    onClick={removePhoto}
                  >
                    Remove Photo
                  </button>
                )}

                <small>
                  JPG, PNG or WEBP
                  <br />
                  Maximum 5 MB
                </small>

              </div>

              {/* FIELDS */}

              <div className="student-fields">

                <div className="student-field-grid">

                  <div className="student-form-group">
                    <label>
                      Student Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter student name"
                      required
                    />
                  </div>

                  <div className="student-form-group">
                    <label>
                      Student ID
                    </label>

                    <input
                      type="text"
                      value={form.id}
                      readOnly
                      className="auto-id-field"
                    />

                    <small>
                      Automatically generated
                    </small>
                  </div>

                </div>

                <div className="student-field-grid">

                  <div className="student-form-group">
                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="student@example.com"
                    />
                  </div>

                  <div className="student-form-group">
                    <label>
                      Phone *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                    />
                  </div>

                </div>

                <div className="student-field-grid">

                  <div className="student-form-group">
                    <label>
                      Course *
                    </label>

                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Course
                      </option>

                      {availableCourses.map(
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

                    {!availableCourses.length && (
                      <small>
                        Add courses from Courses
                        Manager first.
                      </small>
                    )}
                  </div>

                  <div className="student-form-group">
                    <label>
                      Join Date *
                    </label>

                    <input
                      type="date"
                      name="joinDate"
                      value={form.joinDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

                <div className="student-form-group status-field">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
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

            </div>

            <div className="student-form-actions">

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-primary-btn"
              >
                {editing
                  ? 'Update Student'
                  : 'Save Student'}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================================
          STUDENT PROFILE
          ===================================================== */}

      {selectedStudent && (
        <div className="student-profile-card">

          <div className="student-profile-header">

            <div>
              <span className="admin-page-eyebrow">
                STUDENT PROFILE
              </span>

              <h2>
                {selectedStudent.name}
              </h2>

              <span className="student-profile-id">
                {selectedStudent.id}
              </span>
            </div>

            <button
              type="button"
              className="student-close-btn"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              ×
            </button>

          </div>

          <div className="student-profile-body">

            <div className="student-profile-avatar">

              {selectedStudent.image ? (
                <img
                  src={selectedStudent.image}
                  alt={selectedStudent.name}
                />
              ) : (
                <span>
                  {selectedStudent.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </span>
              )}

            </div>

            <div className="student-profile-details">

              <div>
                <span>Course</span>
                <strong>
                  {selectedStudent.course}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedStudent.email || '-'}
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {selectedStudent.phone || '-'}
                </strong>
              </div>

              <div>
                <span>Join Date</span>
                <strong>
                  {formatDate(
                    selectedStudent.joinDate
                  )}
                </strong>
              </div>

              <div>
                <span>Status</span>

                <strong
                  className={
                    selectedStudent.status ===
                    'Active'
                      ? 'student-status active'
                      : 'student-status inactive'
                  }
                >
                  {selectedStudent.status}
                </strong>
              </div>

            </div>

          </div>

          <div className="student-profile-actions">

            <button
              type="button"
              className="admin-secondary-btn"
              onClick={() =>
                openEditStudent(
                  selectedStudent
                )
              }
            >
              Edit Student
            </button>

            <button
              type="button"
              className="admin-danger-btn"
              onClick={() =>
                toggleStatus(
                  selectedStudent
                )
              }
            >
              {selectedStudent.status ===
              'Active'
                ? 'Deactivate'
                : 'Activate'}
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          DIRECTORY
          ===================================================== */}

      <div className="students-directory-card">

        <div className="students-directory-header">

          <div>
            <span className="admin-page-eyebrow">
              STUDENT DIRECTORY
            </span>

            <h2>All Students</h2>
          </div>

          <span className="students-result-count">
            {filteredStudents.length}{' '}
            {filteredStudents.length === 1
              ? 'student'
              : 'students'}
          </span>

        </div>

        {filteredStudents.length === 0 ? (

          <div className="students-empty">

            <div className="students-empty-icon">
              👨‍🎓
            </div>

            <h3>No students found</h3>

            <p>
              Add students manually or upload
              multiple students using Excel.
            </p>

            <div className="students-empty-actions">

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={downloadTemplate}
              >
                ↓ Download Template
              </button>

              <button
                type="button"
                className="admin-primary-btn"
                onClick={openAddStudent}
              >
                + Add Student
              </button>

            </div>

          </div>

        ) : (

          <div className="students-table-wrapper">

            <table className="students-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Course</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.map(
                  (student) => (
                    <tr key={student.id}>

                      <td>

                        <button
                          type="button"
                          className="student-name-button"
                          onClick={() =>
                            viewStudent(
                              student
                            )
                          }
                        >

                          <div className="student-table-avatar">

                            {student.image ? (
                              <img
                                src={
                                  student.image
                                }
                                alt={
                                  student.name
                                }
                              />
                            ) : (
                              <span>
                                {student.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase()}
                              </span>
                            )}

                          </div>

                          <div>

                            <strong>
                              {student.name}
                            </strong>

                            {student.email && (
                              <small>
                                {
                                  student.email
                                }
                              </small>
                            )}

                          </div>

                        </button>

                      </td>

                      <td>
                        <span className="student-id-badge">
                          {student.id}
                        </span>
                      </td>

                      <td>
                        {student.course}
                      </td>

                      <td>
                        {student.phone}
                      </td>

                      <td>
                        {formatDate(
                          student.joinDate
                        )}
                      </td>

                      <td>

                        <span
                          className={
                            student.status ===
                            'Active'
                              ? 'student-status active'
                              : 'student-status inactive'
                          }
                        >
                          {student.status}
                        </span>

                      </td>

                      <td>

                        <div className="student-row-actions">

                          <button
                            type="button"
                            onClick={() =>
                              viewStudent(
                                student
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditStudent(
                                student
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(
                                student
                              )
                            }
                          >
                            {student.status ===
                            'Active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              deleteStudent(
                                student
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================================
          IMPORT MODAL
          ===================================================== */}

      {showImport && (

        <div className="student-modal-overlay">

          <div className="student-import-modal">

            <div className="student-import-header">

              <div>

                <span className="admin-page-eyebrow">
                  BULK IMPORT
                </span>

                <h2>
                  Import Students
                </h2>

                <p>
                  {importFileName}
                </p>

              </div>

              <button
                type="button"
                className="student-close-btn"
                onClick={closeImport}
              >
                ×
              </button>

            </div>

            <div className="student-import-summary">

              <div className="import-valid-count">
                <strong>
                  {importRows.length}
                </strong>

                <span>
                  Ready to Import
                </span>
              </div>

              <div className="import-error-count">
                <strong>
                  {importErrors.length}
                </strong>

                <span>
                  Need Attention
                </span>
              </div>

            </div>

            {importRows.length > 0 && (

              <div className="import-preview">

                <h3>
                  Import Preview
                </h3>

                <div className="import-table-wrapper">

                  <table className="import-table">

                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Course</th>
                        <th>Join Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>

                      {importRows
                        .slice(0, 10)
                        .map(
                          (
                            row,
                            index
                          ) => (
                            <tr
                              key={`${row.phone}-${index}`}
                            >
                              <td>
                                {row.name}
                              </td>

                              <td>
                                {row.phone}
                              </td>

                              <td>
                                {row.course}
                              </td>

                              <td>
                                {formatDate(
                                  row.joinDate
                                )}
                              </td>

                              <td>
                                {row.status}
                              </td>
                            </tr>
                          )
                        )}

                    </tbody>

                  </table>

                </div>

                {importRows.length >
                  10 && (
                  <p className="import-note">
                    Showing first 10 of{' '}
                    {importRows.length}{' '}
                    valid records.
                  </p>
                )}

              </div>

            )}

            {importErrors.length > 0 && (

              <div className="import-errors">

                <h3>
                  ⚠ Records needing attention
                </h3>

                {importErrors.map(
                  (error) => (
                    <div
                      className="import-error-item"
                      key={error.row}
                    >

                      <strong>
                        Row {error.row} —{' '}
                        {error.name}
                      </strong>

                      <ul>
                        {error.messages.map(
                          (message) => (
                            <li
                              key={
                                message
                              }
                            >
                              {message}
                            </li>
                          )
                        )}
                      </ul>

                    </div>
                  )
                )}

              </div>

            )}

            <div className="student-import-actions">

              <button
                type="button"
                className="admin-secondary-btn"
                onClick={closeImport}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-primary-btn"
                disabled={
                  importRows.length === 0
                }
                onClick={importStudents}
              >
                Import{' '}
                {importRows.length}{' '}
                Students
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default StudentsManager