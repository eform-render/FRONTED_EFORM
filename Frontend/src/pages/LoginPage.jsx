import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login, saveSession } from '../services/authServices'
import { getApiErrorMessage } from '../utils/apiError'
import { isAdmin } from '../utils/roles'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setError('')
  }

  const validateForm = () => {
    const nextErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Ingresa un correo electronico valido.'
    }
    if (!form.password) {
      nextErrors.password = 'La contrasena es obligatoria.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      saveSession(res)
      onLogin?.(res.user)
      const nextPath = location.state?.from || (isAdmin(res.user) ? '/dashboard' : '/home')
      navigate(nextPath)
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Credenciales invalidas.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__intro">
          <img src="/logo.jpeg" alt="Logo EFORM" />
          <span>Acceso EFORM</span>
          <h1>Inicia sesion</h1>
          <p>Entra para administrar productos, consultar el catalogo y continuar tus pedidos.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Link to="/home" className="btn btn-outline-secondary btn-sm" style={{ alignSelf: 'flex-start', marginBottom: '12px' }}>
            ← Volver a Inicio
          </Link>
          {location.state?.registered && (
            <div className="alert alert-success">Cuenta creada correctamente. Ahora inicia sesion.</div>
          )}
          {location.state?.passwordReset && (
            <div className="alert alert-success">Contrasena actualizada correctamente. Inicia sesion.</div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}

          <label>
            Correo electronico
            <input
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              value={form.email}
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label>
            Contrasena
            <input
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              type="password"
              onChange={handleChange}
              placeholder="Tu contrasena"
              value={form.password}
            />
            {errors.password && <small>{errors.password}</small>}
          </label>

          <p className="auth-switch auth-switch--right">
            <Link to="/forgot-password">Olvidaste tu contrasena?</Link>
          </p>

          <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="auth-switch">
            No tienes cuenta? <Link to="/register" state={{ from: location.state?.from }}>Registrate</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
