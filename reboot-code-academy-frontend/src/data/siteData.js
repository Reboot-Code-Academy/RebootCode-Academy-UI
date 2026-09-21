export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
  { label: 'Login', path: '/student-login' },
]

export const contactInfo = {
  phone: '+91 98765 43210',
  email: 'hello@rebootcodeacademy.in',
  address: 'India',
}

export const stats = [
  { value: '6+', label: 'Career-focused courses' },
  { value: '24/7', label: 'Practice access' },
  { value: '1:1', label: 'Doubt guidance' },
]

export const announcements = [
  {
    id: 1,
    label: 'New Batch',
    text: 'New Python batch starts from 15 October.',
    actionPath: '/courses',
    startDate: '2026-09-21',
    endDate: '2026-10-15',
    isActive: true,
  },
  {
    id: 2,
    label: 'Book Free Demo',
    text: 'Book a 3-day free demo class for Web Development.',
    actionPath: '/contact',
    startDate: '2026-09-21',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 3,
    label: 'Admissions',
    text: 'Limited seats open for Java Full Stack weekend batch.',
    actionPath: '/courses',
    startDate: '2026-09-21',
    endDate: '2026-10-31',
    isActive: true,
  },
]

export const courses = [
  {
    id: 1,
    name: 'Python Programming',
    level: 'Beginner to Advanced',
    duration: '10 weeks',
    description:
      'Build a strong programming base with Python, problem solving, files, APIs, and mini projects.',
    topics: ['Core Python', 'Projects', 'APIs'],
  },
  {
    id: 2,
    name: 'Java Full Stack',
    level: 'Intermediate',
    duration: '16 weeks',
    description:
      'Learn Java, Spring Boot basics, databases, REST APIs, and frontend integration.',
    topics: ['Java', 'Spring Boot', 'SQL'],
  },
  {
    id: 3,
    name: 'Web Development',
    level: 'Beginner',
    duration: '12 weeks',
    description:
      'Create responsive websites with HTML, CSS, JavaScript, React, and deployment basics.',
    topics: ['HTML/CSS', 'JavaScript', 'React'],
  },
]

export const galleryItems = [
  {
    title: 'Project Lab',
    category: 'Practice',
    description: 'Students build real features and learn how apps are assembled.',
  },
  {
    title: 'Mentor Session',
    category: 'Guidance',
    description: 'Focused doubt solving and roadmap support for each learner.',
  },
  {
    title: 'Demo Class',
    category: 'Live Class',
    description: 'Interactive sessions that show how concepts become working code.',
  },
]

export const adminModules = [
  'Homepage Content',
  'Announcements',
  'Courses',
  'Gallery',
  'Testimonials',
  'Students',
  'Demo Bookings',
  'Course Materials',
  'Contact Information',
]
