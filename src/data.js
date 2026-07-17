const SEED_CATEGORIES = {
  Beverages: [
    { id: 'b1', name: 'Espresso', price: 2.5 },
    {
      id: 'b2',
      name: 'Latte',
      price: 3.5,
      modifierGroups: [
        {
          id: 'size',
          label: 'Size',
          type: 'single',
          options: [
            { name: 'Small', price: 0 },
            { name: 'Medium', price: 0.5 },
            { name: 'Large', price: 1 },
          ],
        },
      ],
    },
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
    {
      id: 's1',
      name: 'Club Sandwich',
      price: 6.5,
      modifierGroups: [
        {
          id: 'extras',
          label: 'Extras',
          type: 'multi',
          options: [
            { name: 'Salty', price: 0 },
            { name: 'Extra Cheese', price: 5 },
          ],
        },
      ],
    },
    { id: 's2', name: 'BLT', price: 5.75 },
    {
      id: 's3',
      name: 'Grilled Cheese',
      price: 4.5,
      modifierGroups: [
        { id: 'extras', label: 'Extras', type: 'multi', options: [{ name: 'Extra Cheese', price: 5 }] },
      ],
    },
  ],
  Extras: [
    { id: 'e1', name: 'Extra Shot', price: 0.75 },
    { id: 'e2', name: 'Oat Milk', price: 0.6 },
    { id: 'e3', name: 'Whipped Cream', price: 0.5 },
  ],
}

export const seedCatalog = Object.entries(SEED_CATEGORIES).flatMap(([category, items]) =>
  items.map((item) => ({ ...item, category, color: '', modifierGroups: item.modifierGroups || [] }))
)

export const groupByCategory = (catalog) =>
  catalog.reduce((acc, item) => {
    ;(acc[item.category] ||= []).push(item)
    return acc
  }, {})

export const seedStaff = [
  { id: 'c1', name: 'Aida' },
  { id: 'c2', name: 'Bek' },
  { id: 'c3', name: 'Nurlan' },
]

export const PIN_LENGTH = 4

export const cartTotal = (cart) => cart.reduce((sum, i) => sum + i.price * i.qty, 0)

export const orderLabel = (tableId) =>
  typeof tableId === 'string' && tableId.startsWith('togo-')
    ? `To Go #${tableId.split('-')[1].slice(-4)}`
    : `Table ${tableId}`

export const resolveCartItem = (item, selectedModifiers) => {
  if (!selectedModifiers.length) return item
  const extra = selectedModifiers.reduce((sum, m) => sum + m.price, 0)
  const names = selectedModifiers.map((m) => m.name).sort()
  return {
    id: `${item.id}__${names.join('+')}`,
    name: item.name,
    price: item.price + extra,
    category: item.category,
    selectedModifiers: selectedModifiers,
  }
}

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
