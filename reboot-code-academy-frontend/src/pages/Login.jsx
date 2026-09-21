function Login({ onNavigate }) {
  return (
    <div className="page auth-page">
      <section className="login-panel">
        <span className="eyebrow">Student Login</span>
        <h1>Access your learning dashboard.</h1>
        <p>
          Authentication will be connected after the backend and database
          foundation is ready.
        </p>
        <form>
          <label>
            Email
            <input placeholder="student@example.com" type="email" />
          </label>
          <label>
            Password
            <input placeholder="Enter password" type="password" />
          </label>
          <button type="button">Login</button>
        </form>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            onNavigate('/admin')
          }}
        >
          Open admin foundation
        </button>
      </section>
    </div>
  )
}

export default Login
