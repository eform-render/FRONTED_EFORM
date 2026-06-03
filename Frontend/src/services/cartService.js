import { reserve, release } from './productService'

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
  try {
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }))
  } catch (e) {
    // no-op if dispatch fails (older browsers)
  }
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

    // try to reserve on backend; rollback if fails
    reserve(product.id, 1).catch((err) => {
      const current2 = getCart()
      const target = current2.find((item) => item.id === product.id && (item.selectedSize || 'Unica') === selectedSize)
      let reverted
      if (target) {
        if ((target.quantity || 0) > 1) {
          reverted = current2.map((item) =>
            item.id === product.id && (item.selectedSize || 'Unica') === selectedSize
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        } else {
          reverted = current2.filter((item) => !(item.id === product.id && (item.selectedSize || 'Unica') === selectedSize))
        }
        saveCart(reverted)
        try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: reverted } })) } catch {}
      }
      try { window.dispatchEvent(new CustomEvent('cartReserveFailed', { detail: { message: err?.response?.data?.message || err.message } })) } catch {}
    })

    return {
      cart: nextCart,
      added: true,
      message: `${product.nombre} talla ${selectedSize} agregado al carrito.`,
    }
  }

  const nextCart = [...cart, { ...product, selectedSize, quantity: 1 }]
  saveCart(nextCart)

  // try to reserve on backend; rollback if fails
  reserve(product.id, 1).catch((err) => {
    const current2 = getCart()
    const reverted = current2.filter((item) => !(item.id === product.id && (item.selectedSize || 'Unica') === selectedSize))
    saveCart(reverted)
    try { window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: reverted } })) } catch {}
    try { window.dispatchEvent(new CustomEvent('cartReserveFailed', { detail: { message: err?.response?.data?.message || err.message } })) } catch {}
  })

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
  const previousQuantity = Number(targetItem?.quantity || 1)
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

  const delta = safeQuantity - previousQuantity
  if (targetItem && delta > 0) {
    reserve(id, delta).catch((err) => {
      const reverted = getCart().map((item) =>
        item.id === id && (item.selectedSize || 'Unica') === selectedSize
          ? { ...item, quantity: previousQuantity }
          : item
      )
      saveCart(reverted)
      try { window.dispatchEvent(new CustomEvent('cartReserveFailed', { detail: { message: err?.response?.data?.message || err.message } })) } catch {}
    })
  }
  if (targetItem && delta < 0) {
    release(id, Math.abs(delta)).catch(() => {
      try { window.dispatchEvent(new CustomEvent('cartReleaseFailed', { detail: { id, qty: Math.abs(delta) } })) } catch {}
    })
  }

  return nextCart
}

export const removeFromCart = (id, selectedSize = 'Unica') => {
  const current = getCart()
  const target = current.find((item) => item.id === id && (item.selectedSize || 'Unica') === selectedSize)
  const removedQty = target ? Number(target.quantity || 0) : 0
  const nextCart = current.filter((item) => !(item.id === id && (item.selectedSize || 'Unica') === selectedSize))
  saveCart(nextCart)

  if (removedQty > 0) {
    release(id, removedQty).catch(() => {
      try { window.dispatchEvent(new CustomEvent('cartReleaseFailed', { detail: { id, qty: removedQty } })) } catch {}
    })
  }

  return nextCart
}

export const clearCart = () => {
  const prev = getCart()
  localStorage.removeItem(CART_KEY)
  try {
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }))
  } catch (e) {
    // ignore
  }

  // release reserved quantities in backend
  prev.forEach((item) => {
    const qty = Number(item.quantity || 0)
    if (qty > 0) release(item.id, qty).catch(() => {})
  })
}

export const checkoutPayment = async (payment) => {
  const response = await axiosClient.post('/payments', payment)
  return response.data
}

export const checkoutCart = () => {
  const prev = getCart()
  const order = {
    id: `EFORM-${Date.now()}`,
    createdAt: new Date().toISOString(),
    items: prev,
    total: prev.reduce((sum, item) => sum + Number(item.precio || 0) * Number(item.quantity || 1), 0),
  }
  localStorage.setItem('lastOrder', JSON.stringify(order))
  localStorage.removeItem(CART_KEY)
  try {
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }))
  } catch (e) {
    // ignore
  }
  return order
}
