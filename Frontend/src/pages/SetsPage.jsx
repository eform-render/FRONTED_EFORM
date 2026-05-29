import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authServices'
import * as setService from '../services/setService'

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
  const [success, setSuccess] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedSets, setSelectedSets] = useState(new Set())
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [filterStock, setFilterStock] = useState('all')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    loadSets()
  }, [navigate])

  const currentUser = getCurrentUser()
  const isAdmin = currentUser?.role === 'admin' || currentUser?.type === 'admin'

  const loadSets = async () => {
    try {
      setLoading(true)
      // Try to load from API, fallback to initial data
      try {
        const data = await setService.getAll()
        setSets(data.map((item) => ({
          ...item,
          productCount: item.productsText.split(',').map((product) => product.trim()).filter(Boolean).length,
        })))
      } catch {
        // Fallback to initial data if API fails
        setSets(initialSets.map((item) => ({
          ...item,
          productCount: item.productsText.split(',').map((product) => product.trim()).filter(Boolean).length,
        })))
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedSets = useMemo(() => {
    let result = sets.filter((set) => {
      const matchesSearch = [set.name, set.description, set.tipoTela, set.productsText]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      
      const matchesStock = filterStock === 'all' 
        ? true 
        : filterStock === 'available' 
          ? set.stock > 0 
          : set.stock === 0

      return matchesSearch && matchesStock
    })

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      if (sortBy === 'price' || sortBy === 'stock') {
        aVal = Number(aVal)
        bVal = Number(bVal)
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })

    return result
  }, [sets, searchTerm, sortBy, sortOrder, filterStock])

  const totalProducts = useMemo(
    () => sets.reduce((sum, set) => sum + (set.productCount || 0), 0),
    [sets]
  )

  const totalStock = useMemo(
    () => sets.reduce((sum, set) => sum + Number(set.stock || 0), 0),
    [sets]
  )

  const avgPrice = useMemo(
    () => sets.length > 0 ? sets.reduce((sum, set) => sum + Number(set.price || 0), 0) / sets.length : 0,
    [sets]
  )

  const lowStockCount = useMemo(
    () => sets.filter((set) => set.stock > 0 && set.stock <= 5).length,
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

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('El nombre del set es obligatorio.')
      return false
    }
    if (!form.price || Number(form.price) < 0) {
      setError('El precio total debe ser un valor valido.')
      return false
    }
    if (form.stock === '' || Number(form.stock) < 0) {
      setError('El stock debe ser un numero entero igual o mayor a cero.')
      return false
    }
    if (!form.tipoTela.trim()) {
      setError('El tipo de tela es obligatorio.')
      return false
    }
    if (!form.tallasText.trim()) {
      setError('Debe especificar al menos una talla.')
      return false
    }
    if (!form.productsText.trim()) {
      setError('Debe incluir al menos un producto.')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    try {
      setFormLoading(true)
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

      if (editingSet) {
        await setService.update(editingSet.id, nextSet)
        setSets((prevSets) => prevSets.map((item) => (item.id === editingSet.id ? nextSet : item)))
        setSuccess('Set actualizado correctamente.')
      } else {
        await setService.create(nextSet)
        setSets((prevSets) => [nextSet, ...prevSets])
        setSuccess('Set creado correctamente.')
      }

      setShowForm(false)
      setEditingSet(null)
      setForm(emptyForm)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Error al guardar el set. Intenta nuevamente.')
      console.error(err)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteSet = async (setId) => {
    if (window.confirm('¿Quieres eliminar este set?')) {
      try {
        setDeleteLoading(true)
        await setService.remove(setId)
        setSets(sets.filter((set) => set.id !== setId))
        setSuccess('Set eliminado correctamente.')
        setTimeout(() => setSuccess(''), 3000)
      } catch (err) {
        setError('Error al eliminar el set.')
        console.error(err)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  const handleSelectSet = (setId) => {
    const newSelected = new Set(selectedSets)
    if (newSelected.has(setId)) {
      newSelected.delete(setId)
    } else {
      newSelected.add(setId)
    }
    setSelectedSets(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedSets.size === filteredAndSortedSets.length) {
      setSelectedSets(new Set())
    } else {
      setSelectedSets(new Set(filteredAndSortedSets.map((s) => s.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedSets.size === 0) {
      setError('Selecciona al menos un set para eliminar.')
      return
    }

    if (window.confirm(`¿Eliminar ${selectedSets.size} set(s)?`)) {
      try {
        setDeleteLoading(true)
        await setService.bulkDelete(Array.from(selectedSets))
        setSets(sets.filter((set) => !selectedSets.has(set.id)))
        setSelectedSets(new Set())
        setSuccess(`${selectedSets.size} set(s) eliminado(s) correctamente.`)
        setTimeout(() => setSuccess(''), 3000)
      } catch (err) {
        setError('Error al eliminar los sets.')
        console.error(err)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  const handleExport = async () => {
    try {
      const blob = await setService.exportSets()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sets-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Error al exportar los sets.')
      console.error(err)
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
          <h1>{isAdmin ? 'Administración de sets' : 'Catálogo de sets'}</h1>
          <p>
            {isAdmin
              ? 'Crea combos de uniformes con productos incluidos, tallas, precio total y stock disponible.'
              : 'Explora nuestros combos de uniformes disponibles.'}
          </p>
        </div>
        <div className="page-header__actions">
          <Link className="btn btn-outline-primary" to="/dashboard">
            Volver al panel
          </Link>
          <Link className="btn btn-outline-primary" to="/products">
            Ver inventario
          </Link>
          {isAdmin && (
            <button className="btn btn-primary btn-lg" onClick={openCreateForm} type="button">
              Crear nuevo set
            </button>
          )}
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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
        {isAdmin && (
          <>
            <article>
              <span>Precio promedio</span>
              <strong>{formatPrice(avgPrice)}</strong>
            </article>
            {lowStockCount > 0 && (
              <article style={{ backgroundColor: '#fff3cd' }}>
                <span>Stock bajo (&le; 5 unidades)</span>
                <strong style={{ color: '#856404' }}>{lowStockCount}</strong>
              </article>
            )}
          </>
        )}
      </section>

      {isAdmin && (
        <section className="filters-section">
          <div className="search-bar">
            <input
              className="form-control"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar sets, telas, tallas o productos..."
              type="text"
              value={searchTerm}
            />
          </div>

          <div className="filter-controls">
            <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} className="form-control">
              <option value="all">Todos los sets</option>
              <option value="available">Con stock disponible</option>
              <option value="out">Agotados</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-control">
              <option value="createdAt">Fecha de creación</option>
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
            </select>

            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-control">
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>

            <button className="btn btn-outline-secondary" onClick={handleExport} type="button">
              Exportar
            </button>

            {selectedSets.size > 0 && (
              <button 
                className="btn btn-outline-danger" 
                onClick={handleBulkDelete} 
                type="button"
                disabled={deleteLoading}
              >
                Eliminar seleccionados ({selectedSets.size})
              </button>
            )}
          </div>
        </section>
      )}

      {!isAdmin && (
        <section className="search-bar">
          <input
            className="form-control"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar sets, telas, tallas o productos..."
            type="text"
            value={searchTerm}
          />
        </section>
      )}

      {isAdmin && filteredAndSortedSets.length > 0 && (
        <div className="bulk-select">
          <label>
            <input
              type="checkbox"
              checked={selectedSets.size === filteredAndSortedSets.length && filteredAndSortedSets.length > 0}
              onChange={handleSelectAll}
            />
            Seleccionar todos ({filteredAndSortedSets.length})
          </label>
        </div>
      )}

      <section className="sets-grid">
        {filteredAndSortedSets.map((setItem) => (
          <article key={setItem.id} className="set-card">
            {isAdmin && (
              <div className="set-card__checkbox">
                <input
                  type="checkbox"
                  checked={selectedSets.has(setItem.id)}
                  onChange={() => handleSelectSet(setItem.id)}
                />
              </div>
            )}

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
                <strong>{setItem.tallas?.join(', ') || 'Única'}</strong>
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
                <strong className={setItem.stock <= 5 ? 'text-warning' : ''}>
                  {setItem.stock}
                </strong>
              </div>
            </div>

            {isAdmin && (
              <div className="set-card__actions">
                <button className="btn btn-outline-primary" type="button" onClick={() => openEditForm(setItem)}>
                  Editar
                </button>
                <button 
                  className="btn btn-outline-danger" 
                  type="button" 
                  onClick={() => handleDeleteSet(setItem.id)}
                  disabled={deleteLoading}
                >
                  Eliminar
                </button>
              </div>
            )}
          </article>
        ))}
      </section>

      {filteredAndSortedSets.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron sets que coincidan con la búsqueda.</p>
          <button className="btn btn-primary" onClick={openCreateForm} type="button">
            Crear primer set
          </button>
        </div>
      )}

      {showForm && isAdmin && (
        <div className="modal">
          <div className="modal-content sets-modal">
            <header className="modal-header">
              <div>
                <span className="home-eyebrow">{editingSet ? 'Editar set' : 'Nuevo set'}</span>
                <h2>{editingSet ? 'Actualizar conjunto' : 'Crear conjunto de productos'}</h2>
              </div>
              <button className="modal-close" type="button" onClick={() => setShowForm(false)} disabled={formLoading}>
                X
              </button>
            </header>

            {error && <div className="alert alert-danger">{error}</div>}

            <form className="set-form" onSubmit={handleSubmit}>
              <label>
                Nombre del set *
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

              <div className="form-grid">
                <label>
                  Tipo de tela *
                  <input 
                    name="tipoTela" 
                    value={form.tipoTela} 
                    onChange={handleChange} 
                    className="form-control" 
                    placeholder="Ej: Algodón, poliéster, lona" 
                    required
                  />
                </label>
                <label>
                  Tallas disponibles *
                  <input 
                    name="tallasText" 
                    value={form.tallasText} 
                    onChange={handleChange} 
                    className="form-control" 
                    placeholder="Ej: S, M, L, XL" 
                    required
                  />
                </label>
              </div>

              <label>
                Productos incluidos *
                <textarea 
                  name="productsText" 
                  value={form.productsText} 
                  onChange={handleChange} 
                  className="form-control" 
                  rows="2" 
                  placeholder="Ej: Camisa, Pantalón, Gorro" 
                  required
                />
              </label>

              <div className="form-grid">
                <label>
                  Precio total *
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
                  Stock disponible *
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
                <button className="btn btn-primary" type="submit" disabled={formLoading}>
                  {formLoading ? 'Guardando...' : (editingSet ? 'Guardar cambios' : 'Crear set')}
                </button>
                <button className="btn btn-secondary" type="button" onClick={() => setShowForm(false)} disabled={formLoading}>
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
