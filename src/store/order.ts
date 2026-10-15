import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/store/cart';
import type { PricingBreakdown } from '@/lib/pricing';

export interface DeliveryAddress {
  name: string;
  phone: string;
  email: string;
  addressLine: string;
  landmark: string;
  pincode: string;
  city: string;
}

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface Order {
  id: string;
  items: CartItem[];
  pricing: PricingBreakdown;
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  specialInstructions: string;
  placedAt: string;
  estimatedDelivery: string;
}

interface OrderState {
  latestOrder: Order | null;
  pastOrders: Order[];
  hasHydrated: boolean;
  placeOrder: (order: Omit<Order, 'id' | 'placedAt' | 'estimatedDelivery'>) => Order;
  setHasHydrated: (val: boolean) => void;
  getLatest: () => Order | null;
}

function generateOrderId(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `HE-${digits}`;
}

function generateEstimatedDelivery(): string {
  const date = new Date(Date.now() + 45 * 60 * 1000);
  return date.toISOString();
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      latestOrder: null,
      pastOrders: [],
      hasHydrated: false,

      placeOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: generateOrderId(),
          placedAt: new Date().toISOString(),
          estimatedDelivery: generateEstimatedDelivery(),
        };
        set((state) => ({
          latestOrder: order,
          pastOrders: [...state.pastOrders, order],
        }));
        return order;
      },

      setHasHydrated: (val) => set({ hasHydrated: val }),

      getLatest: () => get().latestOrder,
    }),
    {
      name: 'hearth-ember-orders',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
