import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'

export default function SetsPage() {
  const navigate = useNavigate()
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSet, setEditingSet] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    tipoTela: '',
    tallasText: '',
    price: '',
    stock: '',
    productsText: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    setTimeout(() => {
      setSets([
        {
          id: 1,
          name: 'Set Básico',
          description: 'Conjunto inicial de uniformes y accesorios',
          tipoTela: 'Algodón mezclilla',
          tallas: ['S', 'M', 'L'],
          price: 320000,
          stock: 12,
          productCount: 5,
          productsText: 'Camisa, Pantalón, Correa, Calcetas, Gorra',
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          name: 'Set Premium',
          description: 'Set con material de mayor durabilidad y acabado premium',
          tipoTela: 'Poliéster reforzado',
          tallas: ['M', 'L', 'XL'],
          price: 520000,
          stock: 8,
          productCount: 8,
          productsText: 'Chaqueta, Pantalón, Camiseta, Zapatillas, Mochila',
          createdAt: '2024-01-20',
        },
        {
          id: 3,
          name: 'Set Económico',
          description: 'Opción económica para pedidos de producción en volumen',
          tipoTela: 'Lino industrial',
          tallas: ['S', 'M', 'L', 'XL'],
          price: 210000,
          stock: 20,
          productCount: 4,
          productsText: 'Camiseta, Pantalón, Gorro, Paquete de etiquetas',
          createdAt: '2024-01-25',
        },
      ])
      setLoading(false)
    }, 400)
  }, [navigate])

  const filteredSets = useMemo(
    () =>
      sets.filter((set) =>
        set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.tipoTela.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.productsText.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, sets]
  )

  const totalProducts = useMemo(
    () => sets.reduce((sum, set) => sum + (set.productCount || 0), 0),
    [sets]
  )

  const totalStock = useMemo(
    () => sets.reduce((sum, set) => sum + (set.stock || 0), 0),
    [sets]
  )

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  const openCreateForm = () => {
    setEditingSet(null)
    setForm({
      name: '',
      description: '',
      tipoTela: '',
      tallasText: '',
      price: '',
      stock: '',
      productsText: '',
    })
    setError('')
    setShowForm(true)
  }

  const openEditForm = (setItem) => {
    setEditingSet(setItem)
    setForm({
      name: setItem.name,
      description: setItem.description,
      tipoTela: setItem.tipoTela,
      tallasText: (setItem.tallas || []).join(', '),
      price: setItem.price?.toString() || '',
      stock: setItem.stock?.toString() || '',
      productsText: setItem.productsText,
    })
    setError('')
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      tipoTela: '',
      tallasText: '',
      price: '',
      stock: '',
      productsText: '',
    })
    setEditingSet(null)
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('El nombre del set es obligatorio.')
      return
    }
    if (!form.price || Number(form.price) < 0) {
      setError('El precio total debe ser un valor valido.')
      return
    }
    if (!form.stock || Number(form.stock) < 0) {
      setError('La cantidad en producción debe ser un numero entero igual o mayor a cero.')
      return
    }

    const newSet = {
      id: editingSet ? editingSet.id : Math.max(0, ...sets.map((item) => item.id)) + 1,
      name: form.name.trim(),
      description: form.description.trim(),
      tipoTela: form.tipoTela.trim(),
      tallas: form.tallasText.split(',').map((t) => t.trim()).filter(Boolean),
      price: Number(form.price),
      stock: Number(form.stock),
      productCount: form.productsText.split(',').map((item) => item.trim()).filter(Boolean).length,
      productsText: form.productsText.trim(),
      createdAt: editingSet ? editingSet.createdAt : new Date().toISOString().split('T')[0],
    }

    setSets((prevSets) => {
      if (editingSet) {
        return prevSets.map((item) => (item.id === editingSet.id ? newSet : item))
      }
      return [newSet, ...prevSets]
    })

    setShowForm(false)
    resetForm()
  }

  const handleDeleteSet = (setId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este set?')) {
      setSets(sets.filter((set) => set.id !== setId))
    }
  }

  if (loading) {
    return <div className="loading">Cargando sets...</div>
  }

  return (
    <main className="sets-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">Sets de producto</span>
          <h1>Administración de Sets</h1>
          <p>
            Crea y edita conjuntos de productos con precio, tallas, tipo de tela y
            stock en producción. Los clientes verán estos sets en su catálogo.
          </p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={openCreateForm}>
          Crear nuevo set
        </button>
      </section>

      <section className="sets-summary">
        <article>
          <span>Total de sets</span>
          <strong>{sets.length}</strong>
        </article>
        <article>
          <span>Productos totales</span>
          <strong>{totalProducts}</strong>
        </article>
        <article>
          <span>En producción</span>
          <strong>{totalStock}</strong>
        </article>
      </section>

      <section className="search-bar">
        <input
          type="text"
          placeholder="Buscar sets, telas, tallas o productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </section>

      <section className="sets-grid">
        {filteredSets.map((setItem) => (
          <article key={setItem.id} className="set-card">
            <div className="set-card__header">
              <div>
                <h3>{setItem.name}</h3>
                <span className="set-date">Creado: {setItem.createdAt}</span>
              </div>
              <span className={setItem.stock > 0 ? 'badge badge--success' : 'badge badge--warning'}>
                {setItem.stock > 0 ? 'En producción' : 'Agotado'}
              </span>
            </div>

            <p>{setItem.description}</p>

            <div className="set-card__details">
              <div>
                <span>Tipo de tela</span>
                <strong>{setItem.tipoTela || 'No especificado'}</strong>
              </div>
              <div>
                <span>Tallas</span>
                <strong>{setItem.tallas?.join(', ') || 'N/A'}</strong>
              </div>
              <div>
                <span>Precio total</span>
                <strong>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(setItem.price)}</strong>
              </div>
            </div>

            <div className="set-card__footer">
              <div>
                <span>Productos en el set</span>
                <strong>{setItem.productCount}</strong>
              </div>
              <div>
                <span>Stock</span>
                <strong>{setItem.stock}</strong>
              </div>
            </div>

            <div className="set-card__actions">
              <button className="btn btn-outline" type="button" onClick={() => openEditForm(setItem)}>
                Editar
              </button>
              <button className="btn btn-danger" type="button" onClick={() => handleDeleteSet(setItem.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </section>

      {filteredSets.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron sets que coincidan con la búsqueda.</p>
          <button className="btn btn-primary" onClick={openCreateForm}>
            Crear primer set
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content sets-modal">
            <header className="modal-header">
              <div>
                <span className="home-eyebrow">{editingSet ? 'Editar set' : 'Nuevo set'}</span>
                <h2>{editingSet ? 'Actualizar conjunto' : 'Crear conjunto de productos'}</h2>
              </div>
              <button className="modal-close" type="button" onClick={() => setShowForm(false)}>
                ×
              </button>
            </header>

            {error && <div className="alert alert-danger">{error}</div>}

            <form className="set-form" onSubmit={handleSubmit}>
              <label>
                Nombre del set
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </label>

              <label>
                Descripción
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                />
              </label>

              <label>
                Tipo de tela
                <input
                  name="tipoTela"
                  value={form.tipoTela}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: Algodón, poliéster, lona"
                />
              </label>

              <label>
                Tallas disponibles
                <input
                  name="tallasText"
                  value={form.tallasText}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Ej: S, M, L, XL"
                />
              </label>

              <label>
                Productos incluidos
                <textarea
                  name="productsText"
                  value={form.productsText}
                  onChange={handleChange}
                  className="form-control"
                  rows="2"
                  placeholder="Ej: Camisa, Pantalón, Gorro"
                />
              </label>

              <div className="form-grid">
                <label>
                  Precio total
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    value={form.price}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </label>

                <label>
                  Stock en producción
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button className="btn btn-primary" type="submit">
                  {editingSet ? 'Guardar cambios' : 'Crear set'}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
