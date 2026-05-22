import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const formatPrice = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const ProductCard = ({ product, isAdmin = false, onAddToCart, onDelete }) => {
  const navigate = useNavigate()
  const stock = Number(product.stock || 0)
  const sizes = product.tallasDisponibles?.length ? product.tallasDisponibles : ['Unica']
  const [selectedSize, setSelectedSize] = useState(sizes[0])

  return (
    <article className={isAdmin ? 'product-card product-card--admin' : 'product-card product-card--client'}>
      <button
        className="product-card__image"
        onClick={() => navigate(`/products/${product.id}`)}
        type="button"
      >
        {product.imageUrl ? <img src={product.imageUrl} alt={product.nombre} /> : <span>Sin imagen</span>}
      </button>

      <div className="product-card__header">
        <span className={stock > 0 ? 'product-status' : 'product-status product-status--empty'}>
          {stock > 0 ? 'Disponible' : 'Sin stock'}
        </span>
        <strong>{formatPrice(product.precio)}</strong>
      </div>

      <h3>{product.nombre}</h3>
      <p>{product.descripcion || 'Producto sin descripcion registrada.'}</p>

      <div className="product-card__stock">
        <span>{isAdmin ? 'Inventario' : 'Unidades disponibles'}</span>
        <strong>{stock}</strong>
      </div>

      {sizes.length > 0 && (
        <div className="product-card__sizes" aria-label="Tallas disponibles">
          {sizes.slice(0, 5).map((size) => (
            <span key={size}>{size}</span>
          ))}
          {sizes.length > 5 && <span>+{sizes.length - 5}</span>}
        </div>
      )}

      {!isAdmin && (
        <label className="product-card__size">
          Talla a comprar
          <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="product-card__note">
        {isAdmin
          ? stock <= 5
            ? 'Revisar stock'
            : 'Inventario estable'
          : stock > 0
            ? 'Listo para agregar'
            : 'No disponible por ahora'}
      </div>

      <div className="product-card__actions">
        <button className="btn btn-outline-primary" onClick={() => navigate(`/products/${product.id}`)}>
          Ver
        </button>
        {isAdmin ? (
          <>
            <button className="btn btn-primary" onClick={() => navigate(`/products/${product.id}/edit`)}>
              Editar
            </button>
            {onDelete && (
              <button className="btn btn-outline-danger" onClick={() => onDelete(product.id)}>
                Eliminar
              </button>
            )}
          </>
        ) : (
          <button
            className="btn btn-primary"
            disabled={stock === 0}
            onClick={() => onAddToCart?.({ ...product, selectedSize })}
          >
            Agregar
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
