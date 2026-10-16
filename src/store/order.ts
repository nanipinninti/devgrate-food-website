import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/store/cart';
import type { PricingBreakdown } from '@/lib/pricing';
import type { Rider } from '@/data/riders';

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

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'cooking'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  pricing: PricingBreakdown;
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  specialInstructions: string;
  placedAt: string;
  estimatedDelivery: string;
  rider: Rider | null;
  statusUpdatedAt: string;
  cancelledAt?: string;
}

interface OrderState {
  latestOrder: Order | null;
  pastOrders: Order[];
  hasHydrated: boolean;
  placeOrder: (order: Omit<Order, 'id' | 'placedAt' | 'estimatedDelivery' | 'rider' | 'statusUpdatedAt'>) => Order;
  cancelOrder: (orderId: string) => void;
  setHasHydrated: (val: boolean) => void;
  getLatest: () => Order | null;
  getOrderById: (id: string) => Order | null;
  getAllOrders: () => Order[];
}

function generateOrderId(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `HE-${digits}`;
}

function generateEstimatedDelivery(): string {
  const date = new Date(Date.now() + 45 * 60 * 1000);
  return date.toISOString();
}

function pickRandomRider(): Rider {
  const { riders } = require('@/data/riders') as { riders: Rider[] };
  return riders[Math.floor(Math.random() * riders.length)];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      latestOrder: null,
      pastOrders: [],
      hasHydrated: false,

      placeOrder: (orderData) => {
        const now = new Date().toISOString();
        const order: Order = {
          ...orderData,
          id: generateOrderId(),
          placedAt: now,
          estimatedDelivery: generateEstimatedDelivery(),
          rider: pickRandomRider(),
          statusUpdatedAt: now,
        };
        set((state) => ({
          latestOrder: order,
          pastOrders: [...state.pastOrders, order],
        }));
        return order;
      },

      cancelOrder: (orderId) => {
        const now = new Date().toISOString();
        set((state) => {
          const updateOrder = (o: Order): Order =>
            o.id === orderId
              ? { ...o, statusUpdatedAt: now, cancelledAt: now }
              : o;
          const latest = state.latestOrder?.id === orderId
            ? updateOrder(state.latestOrder)
            : state.latestOrder;
          return {
            latestOrder: latest,
            pastOrders: state.pastOrders.map(updateOrder),
          };
        });
      },

      setHasHydrated: (val) => set({ hasHydrated: val }),

      getLatest: () => get().latestOrder,

      getOrderById: (id) => {
        const all = get().getAllOrders();
        return all.find((o) => o.id === id) ?? null;
      },

      getAllOrders: () => {
        const state = get();
        const all = [...state.pastOrders];
        if (state.latestOrder && !all.some((o) => o.id === state.latestOrder!.id)) {
          all.unshift(state.latestOrder);
        }
        return all;
      },
    }),
    {
      name: 'hearth-ember-orders',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
