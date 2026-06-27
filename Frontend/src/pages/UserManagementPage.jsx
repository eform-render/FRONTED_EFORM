import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, getAllUsers, changeUserRole, deleteUser } from '../services/authServices'
import { isAdmin } from '../utils/roles'

export default function UserManagementPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [changingRole, setChangingRole] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!isAdmin(user)) {
      navigate('/home')
      return
    }

    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Cargando usuarios...')
      const data = await getAllUsers()
      console.log('Usuarios cargados:', data)
      setUsers(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      console.error('Error al cargar usuarios:', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      })
      let errorMsg = 'No fue posible cargar los usuarios'
      if (err?.response?.status === 403) {
        errorMsg = 'No tienes permiso para ver los usuarios'
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      setError(errorMsg)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (userId, newRole) => {
    if (!window.confirm(`¿Cambiar rol a ${newRole === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'}?`)) {
      return
    }

    try {
      setChangingRole(userId)
      await changeUserRole(userId, newRole)
      setSuccess('Rol actualizado correctamente')
      loadUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar el rol')
    } finally {
      setChangingRole(null)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setDeletingUser(userId)
      await deleteUser(userId)
      setSuccess('Usuario eliminado correctamente')
      loadUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el usuario')
    } finally {
      setDeletingUser(null)
    }
  }

  if (loading) return <div className="loading">Cargando usuarios...</div>

  return (
    <main className="users-page products-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">Gestión de usuarios</span>
          <h1>Administrar usuarios</h1>
          <p>Cambia los roles de los usuarios entre administrador y cliente, o elimina usuarios.</p>
        </div>
        <div className="page-header__actions">
          <Link className="btn btn-outline-primary" to="/dashboard">
            Volver al panel
          </Link>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="users-table">
        {users.length === 0 ? (
          <p className="catalog-message">No hay usuarios registrados</p>
        ) : (
          <div className="table-responsive">
            <table className="users-list">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={u.role === 'ROLE_ADMIN' ? 'badge badge--success' : 'badge badge--secondary'}>
                        {u.role === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'}
                      </span>
                    </td>
                    <td>
                      {u.id !== user?.id && (
                        <div className="user-actions">
                          {u.role === 'ROLE_ADMIN' ? (
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleChangeRole(u.id, 'ROLE_USER')}
                              disabled={changingRole === u.id || deletingUser === u.id}
                              type="button"
                            >
                              {changingRole === u.id ? 'Cambiando...' : 'Hacer Cliente'}
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleChangeRole(u.id, 'ROLE_ADMIN')}
                              disabled={changingRole === u.id || deletingUser === u.id}
                              type="button"
                            >
                              {changingRole === u.id ? 'Cambiando...' : 'Hacer Admin'}
                            </button>
                          )}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={deletingUser === u.id || changingRole === u.id}
                            type="button"
                          >
                            {deletingUser === u.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      )}
                      {u.id === user?.id && (
                        <span className="form-help">Tu cuenta</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
