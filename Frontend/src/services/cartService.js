const CART_KEY = 'cart'

export const getCart = () => {
  const storedCart = localStorage.getItem(CART_KEY)
  if (!storedCart) return []

  try {
    return JSON.parse(storedCart)
  } catch {
    localStorage.removeItem(CART_KEY)
    return []
  }
}

export const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

const getProductQuantityInCart = (cart, productId) => {
  return cart
    .filter((item) => item.id === productId)
    .reduce((sum, item) => sum + Number(item.quantity || 1), 0)
}

export const addToCart = (product) => {
  const cart = getCart()
  const selectedSize = product.selectedSize || 'Unica'
  const stock = Number(product.stock || 0)
  const currentProductQuantity = getProductQuantityInCart(cart, product.id)

  if (stock <= 0 || currentProductQuantity >= stock) {
    return {
      cart,
      added: false,
      message: `No hay mas unidades disponibles de ${product.nombre}. Stock disponible: ${stock}.`,
    }
  }

  const existing = cart.find((item) => item.id === product.id && (item.selectedSize || 'Unica') === selectedSize)

  if (existing) {
    const nextCart = cart.map((item) =>
      item.id === product.id && (item.selectedSize || 'Unica') === selectedSize
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
    saveCart(nextCart)
    return {
      cart: nextCart,
      added: true,
      message: `${product.nombre} talla ${selectedSize} agregado al carrito.`,
    }
  }

  const nextCart = [...cart, { ...product, selectedSize, quantity: 1 }]
  saveCart(nextCart)
  return {
    cart: nextCart,
    added: true,
    message: `${product.nombre} talla ${selectedSize} agregado al carrito.`,
  }
}

export const updateCartQuantity = (id, quantity, selectedSize = 'Unica') => {
  const cart = getCart()
  const productItems = cart.filter((item) => item.id === id)
  const targetItem = productItems.find((item) => (item.selectedSize || 'Unica') === selectedSize)
  const stock = Number(targetItem?.stock || 0)
  const quantityInOtherSizes = productItems
    .filter((item) => (item.selectedSize || 'Unica') !== selectedSize)
    .reduce((sum, item) => sum + Number(item.quantity || 1), 0)
  const maxForSelectedSize = Math.max(1, stock - quantityInOtherSizes)
  const safeQuantity = Math.min(maxForSelectedSize, Math.max(1, Number(quantity) || 1))
  const nextCart = cart.map((item) =>
    item.id === id && (item.selectedSize || 'Unica') === selectedSize ? { ...item, quantity: safeQuantity } : item
  )
  saveCart(nextCart)
  return nextCart
}

export const removeFromCart = (id, selectedSize = 'Unica') => {
  const nextCart = getCart().filter((item) => !(item.id === id && (item.selectedSize || 'Unica') === selectedSize))
  saveCart(nextCart)
  return nextCart
}

export const clearCart = () => {
  localStorage.removeItem(CART_KEY)
}
