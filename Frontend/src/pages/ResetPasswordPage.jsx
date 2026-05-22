import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/authServices'
import { getApiErrorMessage } from '../utils/apiError'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('El enlace de recuperacion no es valido.')
      return
    }
    if (form.password.length < 6) {
      setError('La contrasena debe tener minimo 6 caracteres.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contrasenas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await resetPassword({ token, password: form.password })
      navigate('/login', { state: { passwordReset: true } })
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'No se pudo actualizar la contrasena.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__intro">
          <img src="/logo.jpeg" alt="Logo EFORM" />
          <span>Nueva contrasena</span>
          <h1>Actualiza tu acceso</h1>
          <p>Escribe una nueva contrasena para volver a entrar a tu cuenta.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="alert alert-danger">{error}</div>}

          <label>
            Nueva contrasena
            <input
              name="password"
              className="form-control"
              type="password"
              onChange={handleChange}
              placeholder="Minimo 6 caracteres"
              value={form.password}
            />
          </label>

          <label>
            Confirmar contrasena
            <input
              name="confirmPassword"
              className="form-control"
              type="password"
              onChange={handleChange}
              placeholder="Repite tu contrasena"
              value={form.confirmPassword}
            />
          </label>

          <button className="btn btn-primary btn-lg" disabled={loading} type="submit">
            {loading ? 'Guardando...' : 'Guardar contrasena'}
          </button>

          <p className="auth-switch">
            <Link to="/login">Volver al login</Link>
          </p>
        </form>
      </section>
    </main>
  )
}
