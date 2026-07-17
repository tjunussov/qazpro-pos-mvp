export const CATEGORIES = {
  Beverages: [
    { id: 'b1', name: 'Espresso', price: 2.5 },
    { id: 'b2', name: 'Latte', price: 3.5 },
    { id: 'b3', name: 'Cappuccino', price: 3.5 },
    { id: 'b4', name: 'Americano', price: 3.0 },
    { id: 'b5', name: 'Iced Tea', price: 2.75 },
    { id: 'b6', name: 'Orange Juice', price: 3.0 },
  ],
  Pastries: [
    { id: 'p1', name: 'Croissant', price: 3.25 },
    { id: 'p2', name: 'Muffin', price: 2.75 },
    { id: 'p3', name: 'Bagel', price: 2.5 },
    { id: 'p4', name: 'Danish', price: 3.0 },
  ],
  Sandwiches: [
    { id: 's1', name: 'Club Sandwich', price: 6.5 },
    { id: 's2', name: 'BLT', price: 5.75 },
    { id: 's3', name: 'Grilled Cheese', price: 4.5 },
  ],
  Extras: [
    { id: 'e1', name: 'Extra Shot', price: 0.75 },
    { id: 'e2', name: 'Oat Milk', price: 0.6 },
    { id: 'e3', name: 'Whipped Cream', price: 0.5 },
  ],
}

export const CASHIERS = [
  { id: 'c1', name: 'Aida' },
  { id: 'c2', name: 'Bek' },
  { id: 'c3', name: 'Nurlan' },
]

export const PIN = '1111'

export const cartTotal = (cart) => cart.reduce((sum, i) => sum + i.price * i.qty, 0)

export const addToCart = (cart, item) => {
  const found = cart.find((i) => i.id === item.id)
  return found
    ? cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
    : [...cart, { ...item, qty: 1 }]
}

export const changeCartQty = (cart, id, delta) =>
  cart
    .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
    .filter((i) => i.qty > 0)
