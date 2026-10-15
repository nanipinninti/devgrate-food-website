import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem, AddOn } from '@/data/menu';
import { findCoupon, calculateDiscount, calculatePricing, type PricingBreakdown } from '@/lib/pricing';

export interface CartItem extends MenuItem {
  quantity: number;
  selectedAddOns: AddOn[];
  unitPrice: number;
}

interface ApplyCouponResult {
  success: boolean;
  message: string;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: string | null;
  specialInstructions: string;
  hasHydrated: boolean;
  addItem: (item: MenuItem, quantity?: number, selectedAddOns?: AddOn[]) => void;
  removeItem: (key: string) => void;
  restoreItem: (item: CartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  applyCoupon: (code: string) => ApplyCouponResult;
  removeCoupon: () => void;
  setSpecialInstructions: (text: string) => void;
  setHasHydrated: (val: boolean) => void;
  clear: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getPricing: () => PricingBreakdown;
}

function getItemKey(id: string, addOns: AddOn[]): string {
  const addOnIds = addOns.map((a) => a.id).sort().join(',');
  return `${id}__${addOnIds}`;
}

function getUnitPrice(item: MenuItem, addOns: AddOn[]): number {
  return item.price + addOns.reduce((sum, a) => sum + a.price, 0);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      specialInstructions: '',
      hasHydrated: false,

      addItem: (item, quantity = 1, selectedAddOns = []) =>
        set((state) => {
          const key = getItemKey(item.id, selectedAddOns);
          const existing = state.items.find((i) => getItemKey(i.id, i.selectedAddOns) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                getItemKey(i.id, i.selectedAddOns) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          const unitPrice = getUnitPrice(item, selectedAddOns);
          return {
            items: [...state.items, { ...item, quantity, selectedAddOns, unitPrice }],
          };
        }),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter(
            (i) => getItemKey(i.id, i.selectedAddOns) !== key
          ),
        })),

      restoreItem: (item) =>
        set((state) => {
          const key = getItemKey(item.id, item.selectedAddOns);
          const existing = state.items.find((i) => getItemKey(i.id, i.selectedAddOns) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                getItemKey(i.id, i.selectedAddOns) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => getItemKey(i.id, i.selectedAddOns) !== key)
              : state.items.map((i) =>
                  getItemKey(i.id, i.selectedAddOns) === key ? { ...i, quantity } : i
                ),
        })),

      applyCoupon: (code) => {
        const trimmed = code.trim().toUpperCase();
        if (!trimmed) return { success: false, message: 'Please enter a coupon code' };
        const coupon = findCoupon(trimmed);
        if (!coupon) return { success: false, message: 'Invalid coupon code' };
        const subtotal = get().getTotal();
        if (subtotal < coupon.offer.minOrder) {
          return {
            success: false,
            message: `Minimum order ₹${coupon.offer.minOrder} required for ${coupon.offer.couponCode}`,
          };
        }
        set({ appliedCoupon: trimmed });
        return { success: true, message: `${coupon.offer.title} applied!` };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      setSpecialInstructions: (text) => set({ specialInstructions: text }),

      setHasHydrated: (val) => set({ hasHydrated: val }),

      clear: () => set({ items: [], appliedCoupon: null, specialInstructions: '' }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getPricing: () => {
        const subtotal = get().getTotal();
        let discount = 0;
        const couponCode = get().appliedCoupon;
        if (couponCode) {
          const coupon = findCoupon(couponCode);
          if (coupon) discount = calculateDiscount(coupon, subtotal);
        }
        return calculatePricing(subtotal, discount);
      },
    }),
    {
      name: 'hearth-ember-cart',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export { getItemKey };
