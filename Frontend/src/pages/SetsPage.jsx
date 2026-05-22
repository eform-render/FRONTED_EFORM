import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'

export default function SetsPage() {
  const navigate = useNavigate()
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    setTimeout(() => {
      setSets([
        { id: 1, name: 'Set Basico', description: 'Productos esenciales', productCount: 5, createdAt: '2024-01-15' },
        { id: 2, name: 'Set Premium', description: 'Productos de alta gama', productCount: 8, createdAt: '2024-01-20' },
        { id: 3, name: 'Set Economico', description: 'Productos economicos', productCount: 3, createdAt: '2024-01-25' },
      ])
      setLoading(false)
    }, 1000)
  }, [navigate])

  const filteredSets = sets.filter((set) =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteSet = (setId) => {
    if (window.confirm('Estas seguro de que quieres eliminar este set?')) {
      setSets(sets.filter((set) => set.id !== setId))
    }
  }

  if (loading) {
    return <div className="loading">Cargando sets...</div>
  }

  return (
    <main className="sets-page">
      <div className="page-header">
        <h1>Gestion de Sets</h1>
        <p>Administra tus sets de productos</p>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Crear Nuevo Set
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar sets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>

      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Crear Nuevo Set</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const newSet = {
                id: sets.length + 1,
                name: formData.get('name'),
                description: formData.get('description'),
                productCount: 0,
                createdAt: new Date().toISOString().split('T')[0],
              }
              setSets([...sets, newSet])
              setShowCreateForm(false)
            }}>
              <label>
                Nombre del Set
                <input name="name" type="text" className="form-control" required />
              </label>
              <label>
                Descripcion
                <textarea name="description" className="form-control" required />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Crear</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sets-grid">
        {filteredSets.map((set) => (
          <div key={set.id} className="set-card">
            <div className="set-header">
              <h3>{set.name}</h3>
              <span className="set-date">{set.createdAt}</span>
            </div>
            <p>{set.description}</p>
            <div className="set-stats">
              <span>{set.productCount} productos</span>
            </div>
            <div className="set-actions">
              <Link to={`/sets/${set.id}/edit`} className="btn btn-outline">
                Editar
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteSet(set.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSets.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron sets</p>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            Crear primer set
          </button>
        </div>
      )}
    </main>
  )
}
