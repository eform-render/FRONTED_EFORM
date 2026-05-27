import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../components/products/ProductForm'
import { create, getById, update } from '../services/productService'
import { getCurrentUser } from '../services/authServices'
import { getApiErrorMessage } from '../utils/apiError'
import { isAdmin } from '../utils/roles'

function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAdmin(user)) {
      navigate('/products', { replace: true })
      return
    }

    if (!id) return

    getById(id)
      .then(setInitialData)
      .catch((apiError) => setError(getApiErrorMessage(apiError, 'No se encontro el producto.')))
      .finally(() => setLoading(false))
  }, [id, navigate, user])

  const handleSubmit = async (data) => {
    setError('')
    setSaving(true)
    try {
      if (id) {
        await update(id, data)
      } else {
        await create(data)
      }
      navigate('/products')
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'No fue posible guardar el producto.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="catalog-message">Cargando producto...</div>

  return (
    <main className="form-page">
      <section className="page-header">
        <div>
          <span className="home-eyebrow">{id ? 'Editar producto' : 'Nuevo producto'}</span>
          <h1>{id ? 'Actualizar uniforme' : 'Crear uniforme'}</h1>
          <p>Completa la informacion del catalogo para que los aprendices puedan ver y comprar los productos nuevos.</p>
        </div>
        <div className="page-header__actions">
          <Link className="btn btn-outline-primary" to="/dashboard">
            Volver al panel
          </Link>
          <Link className="btn btn-outline-primary" to="/products">
            Ver inventario
          </Link>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="form-panel">
        <ProductForm
          initialData={initialData}
          loading={saving}
          onSubmit={handleSubmit}
          submitLabel={id ? 'Actualizar producto' : 'Crear producto'}
        />
      </section>
    </main>
  )
}

export default ProductFormPage
