import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/authServices'
import { getApiErrorMessage } from '../utils/apiError'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (form.name.trim().length < 3) {
      nextErrors.name = 'El nombre debe tener minimo 3 caracteres.'
    }
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Ingresa un correo electronico valido.'
    }
    if (form.password.length < 6) {
      nextErrors.password = 'La contrasena debe tener minimo 6 caracteres.'
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Las contrasenas no coinciden.'
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
      await register({
        name: form.name.trim(),
        username: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      navigate('/login', { state: { registered: true } })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'No se pudo crear la cuenta.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__intro">
          <img src="/logo.jpeg" alt="Logo EFORM" />
          <span>Registro EFORM</span>
          <h1>Crea tu cuenta</h1>
          <p>Registrate para administrar productos y acceder al catalogo del proyecto.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="alert alert-danger">{error}</div>}

          <label>
            Nombre
            <input
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              onChange={handleChange}
              placeholder="Tu nombre"
              value={form.name}
            />
            {errors.name && <small>{errors.name}</small>}
          </label>

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
              placeholder="Minimo 6 caracteres"
              value={form.password}
            />
            {errors.password && <small>{errors.password}</small>}
          </label>

          <label>
            Confirmar contrasena
            <input
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              type="password"
              onChange={handleChange}
              placeholder="Repite tu contrasena"
              value={form.confirmPassword}
            />
            {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
          </label>

          <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="auth-switch">
            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
