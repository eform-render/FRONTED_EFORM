import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

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
    <article className={`${styles['product-card']} ${isAdmin ? styles['product-card--admin'] : styles['product-card--client']}`}>
      <button
        className={styles['product-card__image']}
        onClick={() => navigate(`/products/${product.id}`)}
        type="button"
      >
        {product.imageUrl ? <img src={product.imageUrl} alt={product.nombre} /> : <span>Sin imagen</span>}
      </button>

      <div className={styles['product-card__header']}>
        <span className={`${stock > 0 ? styles['product-status'] : `${styles['product-status']} ${styles['product-status--empty']}`}`}>
          {stock > 0 ? 'Disponible' : 'Sin stock'}
        </span>
        <strong>{formatPrice(product.precio)}</strong>
      </div>

      <h3>{product.nombre}</h3>
      <p>{product.descripcion || 'Producto sin descripcion registrada.'}</p>

      {product.tipoTela && (
        <div className={styles['product-card__material']}>
          <span>Tipo de tela</span>
          <strong>{product.tipoTela}</strong>
        </div>
      )}

      <div className={styles['product-card__stock']}>
        <span>{isAdmin ? 'Inventario' : 'Unidades disponibles'}</span>
        <strong>{stock}</strong>
      </div>

      {sizes.length > 0 && (
        <div className={styles['product-card__sizes']} aria-label="Tallas disponibles">
          {sizes.slice(0, 5).map((size) => (
            <span key={size}>{size}</span>
          ))}
          {sizes.length > 5 && <span>+{sizes.length - 5}</span>}
        </div>
      )}

      {!isAdmin && (
        <label className={styles['product-card__size']}>
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

      <div className={styles['product-card__note']}>
        {isAdmin
          ? stock <= 5
            ? 'Revisar stock'
            : 'Inventario estable'
          : stock > 0
            ? 'Listo para agregar'
            : 'No disponible por ahora'}
      </div>

      <div className={styles['product-card__actions']}>
        <button className={`${styles.btn} ${styles['btn-outline-primary']}`} onClick={() => navigate(`/products/${product.id}`)}>
          Ver
        </button>
        {isAdmin ? (
          <>
            <button className={`${styles.btn} ${styles['btn-primary']}`} onClick={() => navigate(`/products/${product.id}/edit`)}>
              Editar
            </button>
            {onDelete && (
              <button className={`${styles.btn} ${styles['btn-outline-danger']}`} onClick={() => onDelete(product.id)}>
                Eliminar
              </button>
            )}
          </>
        ) : (
          <button
            className={`${styles.btn} ${styles['btn-primary']}`}
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
