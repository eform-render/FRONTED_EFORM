import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { resetPassword } from '../services/authServices'
import { getApiErrorMessage } from '../utils/apiError'

const PASSWORD_REGEX = /^(?=.*[A-Z]).{8,10}$/

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
    if (!PASSWORD_REGEX.test(form.password)) {
      setError('La contrasena debe tener entre 8 y 10 caracteres e incluir al menos una mayuscula.')
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

          <PasswordInput
            autoComplete="new-password"
            className="form-control"
            label="Nueva contrasena"
            maxLength={10}
            minLength={8}
            name="password"
            onChange={handleChange}
            placeholder="8 a 10 caracteres y una mayuscula"
            value={form.password}
          />

          <PasswordInput
            autoComplete="new-password"
            className="form-control"
            label="Confirmar contrasena"
            maxLength={10}
            minLength={8}
            name="confirmPassword"
            onChange={handleChange}
            placeholder="Repite tu contrasena"
            value={form.confirmPassword}
          />

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
