import { offers, type Offer } from '@/data/offers';

export const DELIVERY_FEE = 49;
export const FREE_DELIVERY_THRESHOLD = 499;
export const GST_RATE = 0.05;

export interface CouponDiscount {
  type: 'percentage' | 'flat';
  value: number;
  maxCap?: number;
}

const couponMap: Record<string, { offer: Offer; discount: CouponDiscount }> = {};

function buildCouponMap() {
  for (const offer of offers) {
    const upper = offer.couponCode.toUpperCase();
    if (offer.discountType) {
      couponMap[upper] = { offer, discount: offer.discountType };
    } else if (offer.discount.includes('%')) {
      const value = parseInt(offer.discount.replace(/[^\d]/g, ''), 10);
      couponMap[upper] = { offer, discount: { type: 'percentage', value } };
    } else if (offer.discount.includes('Rs') || offer.discount.includes('₹')) {
      const value = parseInt(offer.discount.replace(/[^\d]/g, ''), 10);
      couponMap[upper] = { offer, discount: { type: 'flat', value } };
    }
  }
}

buildCouponMap();

export function findCoupon(code: string): { offer: Offer; discount: CouponDiscount } | null {
  return couponMap[code.toUpperCase()] ?? null;
}

export function getAllCoupons(): { offer: Offer; discount: CouponDiscount }[] {
  return Object.values(couponMap);
}

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  gst: number;
  grandTotal: number;
  freeDelivery: boolean;
  remainingForFree: number;
}

export function calculatePricing(
  subtotal: number,
  discount: number
): PricingBreakdown {
  const afterDiscount = Math.max(0, subtotal - discount);
  const freeDelivery = afterDiscount >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = freeDelivery || subtotal === 0 ? 0 : DELIVERY_FEE;
  const gst = Math.round(afterDiscount * GST_RATE);
  const grandTotal = afterDiscount + deliveryFee + gst;

  return {
    subtotal,
    discount,
    deliveryFee,
    gst,
    grandTotal,
    freeDelivery,
    remainingForFree: Math.max(0, FREE_DELIVERY_THRESHOLD - afterDiscount),
  };
}

export function calculateDiscount(
  coupon: { offer: Offer; discount: CouponDiscount },
  subtotal: number
): number {
  if (subtotal < coupon.offer.minOrder) return 0;

  const { discount } = coupon;
  if (discount.type === 'percentage') {
    const raw = Math.round((subtotal * discount.value) / 100);
    if (discount.maxCap !== undefined) return Math.min(raw, discount.maxCap);
    return raw;
  }
  return discount.value;
}
