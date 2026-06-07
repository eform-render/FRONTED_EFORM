import { useState } from 'react'

const uniformImageFiles = [
  // Uniformes de Salud y Farmacia
  'uniforme-salud-azul-blanco-manga-corta.jpeg',
  'uniforme-salud-azul-blanco-mujer.jpeg',
  'blusa-enfermeria-azul-sena.jpeg',
  'chaqueta-blanca-salud-manga-larga.jpeg',
  'bata-medica-blanca-hombre.jpeg',
  'bata-medica-blanca-mujer.jpeg',
  
  // Camisas Administrativas
  'camisa-blanca-administrativa-mujer.jpeg',
  'camisa-verde-claro-mujer.jpeg',
  'camisa-azul-claro-rayas-hombre.jpeg',
  'camisa-azul-claro-rayas-manga-larga.jpeg',
  'camisa-azul-claro-manga-corta-hombre.jpeg',
  'camisa-azul-claro-manga-corta-mujer.jpeg',
  
  // Pantalones Formales
  'pantalon-negro-formal.jpeg',
  'pantalon-gris-formal.jpeg',
  'pantalon-gris-mujer.jpeg',
  'pantalon-blanco-formal.jpeg',
  'pantalon-azul-rey-formal.jpeg',
  'pantalon-azul-oscuro-formal.jpeg',
  
  // Jeans SENA
  'jean-azul-oscuro-sena-mujer.jpeg',
  'jean-azul-oscuro-sena-hombre.jpeg',
  
  // Ropa Deportiva
  'polo-azul-petroleo-mujer.jpeg',
  'polo-celeste-sena-mujer.jpeg',
  'polo-negro-sena-mujer.jpeg',
  'polo-verde-sena-mujer.jpeg',
  'pantalon-deportivo-azul-liso.jpeg',
  'pantalon-deportivo-azul-petroleo.jpeg',
  'sudadera-azul-sena-franja-blanca.jpeg',
  'jogger-azul-sena-mujer.jpeg',
  'camiseta-deportiva-sena-hombre.jpeg',
  'camiseta-deportiva-sena-mujer.jpeg',

  // Cocina
  'filipina-blanca-cocina-manga-corta.jpeg',
  'delantal-azul-cocina.jpeg',
  'gorro-chef-blanco.jpeg',
]

export default function ProductForm({ initialData = {}, loading = false, onSubmit, submitLabel = 'Guardar' }) {
  const [form, setForm] = useState({
    nombre: initialData?.nombre || '',
    precio: initialData?.precio || '',
    descripcion: initialData?.descripcion || '',
    tipoTela: initialData?.tipoTela || '',
    stock: initialData?.stock ?? '',
    imageUrl: initialData?.imageUrl || '',
    tallasText: initialData?.tallasDisponibles?.join(', ') || '',
  })
  const [errors, setErrors] = useState({})

  const resizeImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.onload = () => {
          const maxSize = 640
          const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(image.width * scale)
          canvas.height = Math.round(image.height * scale)

          const context = canvas.getContext('2d')
          context.drawImage(image, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.72))
        }
        image.onerror = reject
        image.src = reader.result
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, imageUrl: 'Selecciona un archivo de imagen.' })
      return
    }

    try {
      const imageUrl = await resizeImage(file)
      setForm((currentForm) => ({ ...currentForm, imageUrl }))
      setErrors((currentErrors) => ({ ...currentErrors, imageUrl: '' }))
    } catch {
      setErrors({ ...errors, imageUrl: 'No fue posible cargar la imagen.' })
    }
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.nombre.trim()) nextErrors.nombre = 'El nombre es obligatorio.'
    if (form.nombre.trim().length > 150) nextErrors.nombre = 'El nombre no puede superar 150 caracteres.'
    if (form.descripcion.length > 1000) {
      nextErrors.descripcion = 'La descripcion no puede superar 1000 caracteres.'
    }
    if (form.tipoTela.trim().length > 150) {
      nextErrors.tipoTela = 'El tipo de tela no puede superar 150 caracteres.'
    }
    if (form.precio === '' || Number(form.precio) < 0) {
      nextErrors.precio = 'El precio debe ser cero o mayor.'
    }
    if (form.stock === '' || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      nextErrors.stock = 'El stock debe ser un numero entero positivo.'
    }
    if (form.tallasText.length > 300) {
      nextErrors.tallasText = 'La lista de tallas es demasiado larga.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const tallasDisponibles = form.tallasText
      .split(',')
      .map((talla) => talla.trim())
      .filter(Boolean)

    onSubmit({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      tipoTela: form.tipoTela.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
      tallasDisponibles,
    })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <label>
        Nombre del producto
        <input
          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
          name="nombre"
          placeholder="Ej: Uniforme diario SENA"
          value={form.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <small>{errors.nombre}</small>}
      </label>

      <label>
        Precio
        <input
          className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
          min="0"
          name="precio"
          placeholder="Ej: 85000"
          type="number"
          value={form.precio}
          onChange={handleChange}
        />
        {errors.precio && <small>{errors.precio}</small>}
      </label>

      <label>
        Stock
        <input
          className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
          min="0"
          name="stock"
          placeholder="Ej: 20"
          step="1"
          type="number"
          value={form.stock}
          onChange={handleChange}
        />
        {errors.stock && <small>{errors.stock}</small>}
      </label>

      <label className="product-form__wide">
        Descripcion
        <textarea
          className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
          name="descripcion"
          placeholder="Describe talla, material, uso o detalles importantes."
          rows="5"
          value={form.descripcion}
          onChange={handleChange}
        />
        {errors.descripcion && <small>{errors.descripcion}</small>}
      </label>

      <label>
        Tipo de tela
        <input
          className={`form-control ${errors.tipoTela ? 'is-invalid' : ''}`}
          name="tipoTela"
          placeholder="Ej: Algodon, poliester, mezclilla"
          value={form.tipoTela}
          onChange={handleChange}
        />
        {errors.tipoTela && <small>{errors.tipoTela}</small>}
      </label>

      <label className="product-form__wide">
        Tallas disponibles
        <input
          className={`form-control ${errors.tallasText ? 'is-invalid' : ''}`}
          name="tallasText"
          placeholder="Ej: XS, S, M, L, XL o 38, 39, 40"
          value={form.tallasText}
          onChange={handleChange}
        />
        <span className="form-help">Separa cada talla con una coma.</span>
        {errors.tallasText && <small>{errors.tallasText}</small>}
      </label>

      <section className="product-form__photo product-form__wide">
        <div className="product-form__photo-intro">
          <span className="home-eyebrow">Foto del producto</span>
          <h2>Imagen para el catalogo</h2>
          <p>Elige una imagen existente, sube una foto desde tu equipo o pega un enlace.</p>
        </div>

        <div className="product-form__preview">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Vista previa del producto" />
          ) : (
            <span>Vista previa</span>
          )}
        </div>

        <div className="product-form__image-controls">
          <label>
            Subir foto
            <input className="form-control" name="photoFile" type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          <label>
            Link de la foto o imagen cargada
            <input
              className={`form-control ${errors.imageUrl ? 'is-invalid' : ''}`}
              name="imageUrl"
              placeholder="https://ejemplo.com/foto-producto.jpg"
              value={form.imageUrl.startsWith('data:image') ? 'Imagen cargada desde tu equipo' : form.imageUrl}
              onChange={handleChange}
              readOnly={form.imageUrl.startsWith('data:image')}
            />
            {errors.imageUrl && <small>{errors.imageUrl}</small>}
          </label>

          {form.imageUrl && (
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => setForm((currentForm) => ({ ...currentForm, imageUrl: '' }))}
            >
              Quitar imagen
            </button>
          )}
        </div>

        <div className="product-form__gallery">
          <strong>Seleccionar imagen de uniformes</strong>
          <div className="image-picker">
            {uniformImageFiles.map((fileName) => {
              const url = `/images/uniformes/${encodeURI(fileName)}`
              return (
                <button
                  type="button"
                  key={fileName}
                  className={form.imageUrl === url ? 'image-picker__item is-selected' : 'image-picker__item'}
                  onClick={() => setForm((currentForm) => ({ ...currentForm, imageUrl: url }))}
                >
                  <img src={url} alt={fileName} />
                  <span>{fileName.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}</span>
                </button>
              )
            })}
          </div>
          <span className="form-help">Elige una imagen existente de uniformes para el producto.</span>
        </div>
      </section>

      <button className="btn btn-primary btn-lg product-form__wide" disabled={loading} type="submit">
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
