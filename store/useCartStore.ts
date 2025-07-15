import { create } from 'zustand';

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};
type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Delivered'; // 🆕 added status
};

type CartStore = {
  items: CartItem[];
  orders: Order[]; // NEW
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: () => void; // NEW
};



export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  orders: [],

  addToCart: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },

  removeFromCart: (id) => {
    set({ items: get().items.filter((item) => item.id !== id) });
  },

  clearCart: () => {
    set({ items: [] });
  },

  placeOrder: () => {
  const items = get().items;
  if (items.length === 0) return;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const newOrder: Order = {
    id: Date.now().toString(),
    items,
    total,
    date: new Date().toLocaleString(),
    status: 'Pending', // 🆕 default status
  };

  set((state) => ({
    orders: [newOrder, ...state.orders],
    items: [],
  }));
},
updateOrderStatus: (id: string, status: 'Pending' | 'Delivered') => {
  set((state) => ({
    orders: state.orders.map((order) =>
      order.id === id ? { ...order, status } : order
    ),
  }));
},
}));
