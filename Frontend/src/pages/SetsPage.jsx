import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'

const initialSets = [
  {
    id: 1,
    name: 'Set Basico',
    description: 'Conjunto inicial de uniformes y accesorios.',
    tipoTela: 'Algodon mezclilla',
    tallas: ['S', 'M', 'L'],
    price: 320000,
    stock: 12,
    productsText: 'Camisa, Pantalon, Correa, Calcetas, Gorra',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Set Premium',
    description: 'Set con material de mayor durabilidad y acabado premium.',
    tipoTela: 'Poliester reforzado',
    tallas: ['M', 'L', 'XL'],
    price: 520000,
    stock: 8,
    productsText: 'Chaqueta, Pantalon, Camiseta, Zapatillas, Mochila',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    name: 'Set Economico',
    description: 'Opcion economica para pedidos de produccion en volumen.',
    tipoTela: 'Lino industrial',
    tallas: ['S', 'M', 'L', 'XL'],
    price: 210000,
    stock: 20,
    productsText: 'Camiseta, Pantalon, Gorro, Paquete de etiquetas',
    createdAt: '2024-01-25',
  },
]

const emptyForm = {
  name: '',
  description: '',
  tipoTela: '',
  tallasText: '',
  price: '',
  stock: '',
  productsText: '',
}

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

export default function SetsPage() {
  const navigate = useNavigate()
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSet, setEditingSet] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    setSets(initialSets.map((item) => ({
      ...item,
      productCount: item.productsText.split(',').map((product) => product.trim()).filter(Boolean).length,
    })))
    setLoading(false)
  }, [navigate])

  const filteredSets = useMemo(
    () =>
      sets.filter((set) =>
        [set.name, set.description, set.tipoTela, set.productsText]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [searchTerm, sets]
  )

  const totalProducts = useMemo(
    () => sets.reduce((sum, set) => sum + (set.productCount || 0), 0),
    [sets]
  )

  const totalStock = useMemo(
    () => sets.reduce((sum, set) => sum + Number(set.stock || 0), 0),
    [sets]
  )

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setError('')
  }

  const openCreateForm = () => {
    setEditingSet(null)
    setForm(emptyForm)
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
    if (form.stock === '' || Number(form.stock) < 0) {
      setError('El stock debe ser un numero entero igual o mayor a cero.')
      return
    }

    const products = form.productsText.split(',').map((item) => item.trim()).filter(Boolean)
    const nextSet = {
      id: editingSet ? editingSet.id : Math.max(0, ...sets.map((item) => item.id)) + 1,
      name: form.name.trim(),
      description: form.description.trim(),
      tipoTela: form.tipoTela.trim(),
      tallas: form.tallasText.split(',').map((item) => item.trim()).filter(Boolean),
      price: Number(form.price),
      stock: Number(form.stock),
      productCount: products.length,
      productsText: products.join(', '),
      createdAt: editingSet ? editingSet.createdAt : new Date().toISOString().split('T')[0],
    }

    setSets((prevSets) =>
      editingSet ? prevSets.map((item) => (item.id === editingSet.id ? nextSet : item)) : [nextSet, ...prevSets]
    )
    setShowForm(false)
    setEditingSet(null)
    setForm(emptyForm)
  }

  const handleDeleteSet = (setId) => {
    if (window.confirm('Quieres eliminar este set?')) {
      setSets(sets.filter((set) => set.id !== setId))
    }
  }

  if (loading) {
    return <div className="loading">Cargando sets...</div>
  }

  return (
    <main className="sets-page products-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">Sets EFORM</span>
          <h1>Administracion de sets</h1>
          <p>Crea combos de uniformes con productos incluidos, tallas, precio total y stock disponible.</p>
        </div>
        <div className="page-header__actions">
          <Link className="btn btn-outline-primary" to="/dashboard">
            Volver al panel
          </Link>
          <Link className="btn btn-outline-primary" to="/products">
            Ver inventario
          </Link>
          <button className="btn btn-primary btn-lg" onClick={openCreateForm} type="button">
            Crear nuevo set
          </button>
        </div>
      </section>

      <section className="sets-summary">
        <article>
          <span>Total de sets</span>
          <strong>{sets.length}</strong>
        </article>
        <article>
          <span>Productos incluidos</span>
          <strong>{totalProducts}</strong>
        </article>
        <article>
          <span>Unidades disponibles</span>
          <strong>{totalStock}</strong>
        </article>
      </section>

      <section className="search-bar">
        <input
          className="form-control"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar sets, telas, tallas o productos..."
          type="text"
          value={searchTerm}
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
                {setItem.stock > 0 ? 'Disponible' : 'Agotado'}
              </span>
            </div>

            <p>{setItem.description}</p>

            <div className="set-card__products">
              {(setItem.productsText || '').split(',').map((product) => product.trim()).filter(Boolean).map((product) => (
                <span key={product}>{product}</span>
              ))}
            </div>

            <div className="set-card__details">
              <div>
                <span>Tipo de tela</span>
                <strong>{setItem.tipoTela || 'No especificado'}</strong>
              </div>
              <div>
                <span>Tallas</span>
                <strong>{setItem.tallas?.join(', ') || 'Unica'}</strong>
              </div>
              <div>
                <span>Precio total</span>
                <strong>{formatPrice(setItem.price)}</strong>
              </div>
            </div>

            <div className="set-card__footer">
              <div>
                <span>Productos</span>
                <strong>{setItem.productCount}</strong>
              </div>
              <div>
                <span>Stock</span>
                <strong>{setItem.stock}</strong>
              </div>
            </div>

            <div className="set-card__actions">
              <button className="btn btn-outline-primary" type="button" onClick={() => openEditForm(setItem)}>
                Editar
              </button>
              <button className="btn btn-outline-danger" type="button" onClick={() => handleDeleteSet(setItem.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </section>

      {filteredSets.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron sets que coincidan con la busqueda.</p>
          <button className="btn btn-primary" onClick={openCreateForm} type="button">
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
                X
              </button>
            </header>

            {error && <div className="alert alert-danger">{error}</div>}

            <form className="set-form" onSubmit={handleSubmit}>
              <label>
                Nombre del set
                <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
              </label>

              <label>
                Descripcion
                <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows="3" />
              </label>

              <div className="form-grid">
                <label>
                  Tipo de tela
                  <input name="tipoTela" value={form.tipoTela} onChange={handleChange} className="form-control" placeholder="Ej: Algodon, poliester, lona" />
                </label>
                <label>
                  Tallas disponibles
                  <input name="tallasText" value={form.tallasText} onChange={handleChange} className="form-control" placeholder="Ej: S, M, L, XL" />
                </label>
              </div>

              <label>
                Productos incluidos
                <textarea name="productsText" value={form.productsText} onChange={handleChange} className="form-control" rows="2" placeholder="Ej: Camisa, Pantalon, Gorro" />
              </label>

              <div className="form-grid">
                <label>
                  Precio total
                  <input name="price" type="number" min="0" step="1000" value={form.price} onChange={handleChange} className="form-control" required />
                </label>

                <label>
                  Stock disponible
                  <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} className="form-control" required />
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
