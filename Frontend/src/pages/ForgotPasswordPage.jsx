import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/authServices'
import { getApiErrorMessage } from '../utils/apiError'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResponse(null)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Ingresa un correo electronico valido.')
      return
    }

    setLoading(true)
    try {
      const res = await forgotPassword({ email: email.trim().toLowerCase() })
      setResponse(res)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'No se pudo generar el enlace de recuperacion.'))
    } finally {
      setLoading(false)
    }
  }

  const getResetPath = (resetLink) => {
    try {
      const url = new URL(resetLink, window.location.origin)
      return `${url.pathname}${url.search}`
    } catch {
      return '/reset-password'
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__intro">
          <img src="/logo.jpeg" alt="Logo EFORM" />
          <span>Recuperacion EFORM</span>
          <h1>Recupera tu cuenta</h1>
          <p>Solicita un enlace para crear una nueva contrasena y volver a ingresar.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="alert alert-danger">{error}</div>}
          {response && (
            <div className="alert alert-success">
              <p>{response.message}</p>
              {response.resetLink && (
                <Link to={getResetPath(response.resetLink)}>
                  Abrir enlace de recuperacion
                </Link>
              )}
            </div>
          )}

          <label>
            Correo electronico
            <input
              name="email"
              type="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              value={email}
            />
          </label>

          <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
            {loading ? 'Generando...' : 'Enviar enlace'}
          </button>

          <p className="auth-switch">
            Recordaste tu contrasena? <Link to="/login">Inicia sesion</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
