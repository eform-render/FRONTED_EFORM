import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, saveSession } from '../services/authServices'
import { updateProfile, changePassword, uploadAvatar } from '../services/profileService'
import '../styles/ProfilePage.css'

const ProfilePage = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [activeTab, setActiveTab] = useState('info')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Tab: Información Personal
  const [username, setUsername] = useState(user?.username || '')
  const [email, setEmail] = useState(user?.email || '')

  // Tab: Cambiar Contraseña
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Tab: Foto de Perfil
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '')
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const clearMessages = () => {
    setMessage('')
    setError('')
  }

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
    clearMessages()

    if (!username.trim() || !email.trim()) {
      setError('El nombre de usuario y email son requeridos')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Ingresa un email válido')
      return
    }

    try {
      setLoading(true)
      const response = await updateProfile({
        username: username.trim(),
        email: email.trim()
      })

      saveSession({ token: localStorage.getItem('token'), user: response })
      setMessage('Perfil actualizado exitosamente')
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil')
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    clearMessages()

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Completa todos los campos')
      return
    }

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      setLoading(true)
      await changePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim()
      })

      setMessage('Contraseña actualizada exitosamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña')
      setLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target.result)
      }
      reader.readAsDataURL(file)
      setSelectedFile(file)
    }
  }

  const handleUploadAvatar = async (e) => {
    e.preventDefault()
    clearMessages()

    if (!selectedFile) {
      setError('Selecciona una imagen')
      return
    }

    try {
      setLoading(true)
      const response = await uploadAvatar(selectedFile)

      saveSession({ token: localStorage.getItem('token'), user: response })
      setMessage('Foto de perfil actualizada exitosamente')
      setSelectedFile(null)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir la foto de perfil')
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Mi Perfil</h1>

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('info')
              clearMessages()
            }}
          >
            Información Personal
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('password')
              clearMessages()
            }}
          >
            Cambiar Contraseña
          </button>
          <button
            className={`tab-button ${activeTab === 'avatar' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('avatar')
              clearMessages()
            }}
          >
            Foto de Perfil
          </button>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Tab: Información Personal */}
        {activeTab === 'info' && (
          <form onSubmit={handleUpdateInfo} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        )}

        {/* Tab: Cambiar Contraseña */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Contraseña actual</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Nueva contraseña</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa la nueva contraseña"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma la nueva contraseña"
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}

        {/* Tab: Foto de Perfil */}
        {activeTab === 'avatar' && (
          <form onSubmit={handleUploadAvatar} className="profile-form">
            <div className="avatar-section">
              <div className="avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Vista previa" />
                ) : (
                  <div className="avatar-placeholder">
                    <span>Sin foto de perfil</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="avatarInput">Selecciona una imagen</label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="form-control"
                />
                <p className="help-text">Formatos soportados: JPG, PNG, GIF. Máximo 5MB</p>
              </div>

              {selectedFile && (
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Subiendo...' : 'Subir Foto'}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
