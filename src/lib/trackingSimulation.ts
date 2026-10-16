import type { OrderStatus } from '@/store/order';

export const DEMO_SPEED_MS = 3 * 60 * 1000;
export const REALISTIC_SPEED_MS = 45 * 60 * 1000;

export const STATUS_SEQUENCE: OrderStatus[] = [
  'received',
  'preparing',
  'cooking',
  'packed',
  'out_for_delivery',
  'delivered',
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Order Received',
  preparing: 'Being Prepared',
  cooking: 'Now Cooking',
  packed: 'Packed & Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  received: 'Your order has been logged in our kitchen ledger.',
  preparing: 'Ingredients measured and marinades mixed.',
  cooking: 'Over open flame, your supper takes shape.',
  packed: 'Sealed warm and ready for the road.',
  out_for_delivery: 'Your rider is en route with your meal.',
  delivered: 'Enjoy your supper from the hearth.',
  cancelled: 'This order has been cancelled.',
};

export interface OrderProgress {
  status: OrderStatus;
  percentComplete: number;
  remainingMs: number;
  stageTimestamps: Record<OrderStatus, string | null>;
  riderProgress: number;
}

export function deriveProgress(
  placedAt: string,
  estimatedDelivery: string,
  now: number,
  totalDurationMs: number,
  cancelledAt?: string
): OrderProgress {
  if (cancelledAt) {
    return {
      status: 'cancelled',
      percentComplete: 0,
      remainingMs: 0,
      stageTimestamps: {
        received: null,
        preparing: null,
        cooking: null,
        packed: null,
        out_for_delivery: null,
        delivered: null,
        cancelled: null,
      },
      riderProgress: 0,
    };
  }

  const placed = new Date(placedAt).getTime();
  const elapsed = now - placed;
  const stageDuration = totalDurationMs / STATUS_SEQUENCE.length;

  const stageTimestamps: Record<OrderStatus, string | null> = {} as Record<OrderStatus, string | null>;
  for (let i = 0; i < STATUS_SEQUENCE.length; i++) {
    const stageEnd = (i + 1) * stageDuration;
    if (elapsed >= stageEnd) {
      stageTimestamps[STATUS_SEQUENCE[i]] = new Date(placed + stageEnd).toISOString();
    } else if (elapsed >= i * stageDuration) {
      stageTimestamps[STATUS_SEQUENCE[i]] = null;
    } else {
      stageTimestamps[STATUS_SEQUENCE[i]] = null;
    }
  }

  const currentStageIndex = Math.min(
    Math.floor(elapsed / stageDuration),
    STATUS_SEQUENCE.length - 1
  );

  const status = STATUS_SEQUENCE[currentStageIndex];
  const percentComplete = Math.min(100, (elapsed / totalDurationMs) * 100);
  const remainingMs = Math.max(0, totalDurationMs - elapsed);

  let riderProgress = 0;
  if (status === 'out_for_delivery') {
    const deliveryStart = 4 * stageDuration;
    const deliveryEnd = 5 * stageDuration;
    riderProgress = Math.min(1, Math.max(0, (elapsed - deliveryStart) / (deliveryEnd - deliveryStart)));
  } else if (status === 'delivered') {
    riderProgress = 1;
  }

  return {
    status,
    percentComplete,
    remainingMs,
    stageTimestamps,
    riderProgress,
  };
}

export function isWithinCancellationWindow(placedAt: string, now: number): boolean {
  const elapsed = now - new Date(placedAt).getTime();
  return elapsed < 2 * 60 * 1000;
}

export function getCancellationRemainingMs(placedAt: string, now: number): number {
  const elapsed = now - new Date(placedAt).getTime();
  return Math.max(0, 2 * 60 * 1000 - elapsed);
}
