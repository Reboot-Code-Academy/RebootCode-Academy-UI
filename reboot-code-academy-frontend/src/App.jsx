import { useEffect, useState } from 'react'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import About from './pages/About.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Contact from './pages/Contact.jsx'
import Courses from './pages/Courses.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'

const routes = {
  '/': Home,
  '/courses': Courses,
  '/about': About,
  '/gallery': Gallery,
  '/contact': Contact,
  '/login': Login,
  '/admin': AdminDashboard,
}

function getCurrentPath() {
  return window.location.pathname in routes ? window.location.pathname : '/'
}

function App() {
  const [path, setPath] = useState(getCurrentPath)
  const Page = routes[path]

  useEffect(() => {
    const handlePopState = () => {
      setPath(getCurrentPath())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  function navigate(nextPath) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <Navbar activePath={path} onNavigate={navigate} />
      <main>
        <Page onNavigate={navigate} />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  )
}

export default App
