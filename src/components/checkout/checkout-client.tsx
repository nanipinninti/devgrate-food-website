'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IndianRupee, ChevronLeft, ChevronRight, Check, Clock, CreditCard, Wallet, Banknote, MapPin, Edit, Loader2 } from 'lucide-react';
import { useCart } from '@/store/cart';
import { useOrderStore, type DeliveryAddress, type PaymentMethod } from '@/store/order';
import { calculatePricing, calculateDiscount, findCoupon } from '@/lib/pricing';
import { site } from '@/data/site';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { cn } from '@/lib/utils';

const deliverySchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  addressLine: z.string().min(5, 'Please enter your full address'),
  landmark: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  city: z.string().min(2, 'Please enter your city'),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM',
];

const BANGALORE_PINCODES: Record<string, string> = {
  '560001': 'MG Road',
  '560038': 'Indiranagar',
  '560034': 'Koramangala',
  '560102': 'HSR Layout',
  '560066': 'Whitefield',
  '560041': 'Jayanagar',
  '560076': 'BTM Layout',
  '560050': 'Ashok Nagar',
};

const STEPS = ['Delivery', 'Payment', 'Review'] as const;
type StepIndex = 0 | 1 | 2;

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const hasHydrated = useCart((s) => s.hasHydrated);
  const clearCart = useCart((s) => s.clear);
  const specialInstructions = useCart((s) => s.specialInstructions);
  const appliedCoupon = useCart((s) => s.appliedCoupon);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const pricing = calculatePricing(subtotal, appliedCoupon ? calculateDiscount(findCoupon(appliedCoupon)!, subtotal) : 0);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const prefersReduced = useReducedMotion();

  const [step, setStep] = useState<StepIndex>(0);
  const [direction, setDirection] = useState(1);
  const [deliveryType, setDeliveryType] = useState<'now' | 'schedule'>('now');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [deliveryData, setDeliveryData] = useState<DeliveryFormData | null>(null);
  const [placing, setPlacing] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    mode: 'onBlur',
  });

  // Redirect to cart if empty (after hydration)
  useEffect(() => {
    if (hasHydrated && items.length === 0) {
      router.replace('/cart');
    }
  }, [hasHydrated, items.length, router]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const goToStep = (newStep: StepIndex) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleDeliverySubmit = (data: DeliveryFormData) => {
    setDeliveryData(data);
    setDirection(1);
    setStep(1);
  };

  const handleContinueToReview = () => {
    setDirection(1);
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (!deliveryData) return;
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        items: [...items],
        pricing,
        address: deliveryData as DeliveryAddress,
        paymentMethod,
        specialInstructions,
      });
      clearCart();
      router.push('/order-confirmed');
    }, 1500);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: prefersReduced ? 0 : dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: prefersReduced ? 0 : dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sepia">
          <li><span className="font-elite text-[10px] uppercase tracking-wider">Home</span></li>
          <li className="text-brass">/</li>
          <li><span className="font-elite text-[10px] uppercase tracking-wider">Basket</span></li>
          <li className="text-brass">/</li>
          <li className="font-elite text-[10px] uppercase tracking-wider text-ink">Checkout</li>
        </ol>
      </nav>

      {/* Step indicator - vintage ticket stub */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-0 max-w-2xl mx-auto">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center font-elite text-sm border-2 transition-all',
                    i <= step
                      ? 'bg-oxblood text-cream border-brass shadow-vintage-card'
                      : 'bg-parchment text-sepia border-brass/30'
                  )}
                >
                  {i < step ? <Check className="h-5 w-5" strokeWidth={2} /> : i + 1}
                </div>
                <span className={cn(
                  'font-elite text-[9px] uppercase tracking-wider',
                  i <= step ? 'text-oxblood' : 'text-sepia'
                )}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-brass/20 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-brass"
                    initial={{ width: '0%' }}
                    animate={{ width: i < step ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Main step content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={prefersReduced ? { duration: 0.15 } : { type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Step 1: Delivery */}
              {step === 0 && (
                <form onSubmit={handleSubmit(handleDeliverySubmit)} className="space-y-5">
                  <h2 className="font-playfair text-2xl font-bold text-ink">Delivery Details</h2>
                  <OrnamentDivider width="sm" className="self-start" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" error={errors.name?.message}>
                      <input
                        {...register('name')}
                        aria-invalid={!!errors.name}
                        className="checkout-input"
                        placeholder="Arjun Mehta"
                      />
                    </FormField>
                    <FormField label="Phone Number" error={errors.phone?.message}>
                      <input
                        {...register('phone')}
                        aria-invalid={!!errors.phone}
                        className="checkout-input"
                        placeholder="9876543210"
                        inputMode="numeric"
                        maxLength={10}
                      />
                    </FormField>
                  </div>

                  <FormField label="Email Address" error={errors.email?.message}>
                    <input
                      {...register('email')}
                      aria-invalid={!!errors.email}
                      className="checkout-input"
                      placeholder="arjun@example.com"
                      type="email"
                    />
                  </FormField>

                  <FormField label="Address Line" error={errors.addressLine?.message}>
                    <input
                      {...register('addressLine')}
                      aria-invalid={!!errors.addressLine}
                      className="checkout-input"
                      placeholder="Flat 402, Lake View Apartments"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Landmark (optional)">
                      <input
                        {...register('landmark')}
                        className="checkout-input"
                        placeholder="Near City Park"
                      />
                    </FormField>
                    <FormField label="City" error={errors.city?.message}>
                      <input
                        {...register('city')}
                        aria-invalid={!!errors.city}
                        className="checkout-input"
                        placeholder="Bengaluru"
                      />
                    </FormField>
                  </div>

                  <FormField label="Pincode" error={errors.pincode?.message}>
                    <input
                      {...register('pincode')}
                      aria-invalid={!!errors.pincode}
                      className="checkout-input"
                      placeholder="560001"
                      inputMode="numeric"
                      maxLength={6}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        e.target.value = val;
                      }}
                    />
                    <PincodeCheck pincode={watch('pincode') || ''} />
                  </FormField>

                  {/* Delivery type toggle */}
                  <div>
                    <span className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-2">
                      Delivery Time
                    </span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('now')}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 border-2 transition-colors',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
                          deliveryType === 'now' ? 'border-brass bg-cream' : 'border-brass/20 bg-parchment hover:border-brass/40'
                        )}
                      >
                        <Clock className="h-4 w-4 text-brass" strokeWidth={1.5} />
                        <span className="font-elite text-[10px] uppercase tracking-wider text-ink">Deliver Now</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('schedule')}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 border-2 transition-colors',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
                          deliveryType === 'schedule' ? 'border-brass bg-cream' : 'border-brass/20 bg-parchment hover:border-brass/40'
                        )}
                      >
                        <Clock className="h-4 w-4 text-brass" strokeWidth={1.5} />
                        <span className="font-elite text-[10px] uppercase tracking-wider text-ink">Schedule for Later</span>
                      </button>
                    </div>
                  </div>

                  {/* Time slot picker */}
                  <AnimatePresence>
                    {deliveryType === 'schedule' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <span className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-2">
                          Select a Time Slot
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={cn(
                                'px-3 py-1.5 border font-elite text-[10px] uppercase tracking-wider transition-colors',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
                                selectedSlot === slot
                                  ? 'border-oxblood bg-oxblood/10 text-oxblood'
                                  : 'border-brass/20 bg-parchment text-sepia hover:border-brass/40'
                              )}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Continue button */}
                  <div className="pt-4">
                    <VintageButton type="submit" size="lg">
                      Continue to Payment
                      <ChevronRight className="inline h-4 w-4 ml-1" />
                    </VintageButton>
                  </div>
                </form>
              )}

              {/* Step 2: Payment */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-playfair text-2xl font-bold text-ink">Payment Method</h2>
                  <OrnamentDivider width="sm" className="self-start" />

                  <div className="space-y-3">
                    <PaymentCard
                      selected={paymentMethod === 'upi'}
                      onSelect={() => setPaymentMethod('upi')}
                      icon={<Wallet className="h-5 w-5" strokeWidth={1.5} />}
                      label="UPI"
                      description="Pay using any UPI app"
                    />
                    <AnimatePresence>
                      {paymentMethod === 'upi' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-parchment border border-brass/20 p-4 ml-4">
                            <label htmlFor="upi-id" className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-2">
                              UPI ID
                            </label>
                            <input
                              id="upi-id"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="yourname@upi"
                              className="checkout-input"
                            />
                            <p className="font-cormorant text-xs italic text-sepia mt-2">
                              This is a demo — no real payment will be processed.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <PaymentCard
                      selected={paymentMethod === 'card'}
                      onSelect={() => setPaymentMethod('card')}
                      icon={<CreditCard className="h-5 w-5" strokeWidth={1.5} />}
                      label="Credit / Debit Card"
                      description="Visa, Mastercard, RuPay"
                    />
                    <AnimatePresence>
                      {paymentMethod === 'card' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-parchment border border-brass/20 p-4 ml-4 space-y-3">
                            <div>
                              <label htmlFor="card-number" className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-2">
                                Card Number
                              </label>
                              <input
                                id="card-number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                placeholder="0000 0000 0000 0000"
                                className="checkout-input"
                                inputMode="numeric"
                                maxLength={19}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="card-expiry" className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-2">
                                  Expiry
                                </label>
                                <input
                                  id="card-expiry"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                  placeholder="MM/YY"
                                  className="checkout-input"
                                  inputMode="numeric"
                                  maxLength={5}
                                />
                              </div>
                              <div>
                                <label htmlFor="card-cvv" className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-2">
                                  CVV
                                </label>
                                <input
                                  id="card-cvv"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                  placeholder="000"
                                  className="checkout-input"
                                  inputMode="numeric"
                                  maxLength={3}
                                  type="password"
                                />
                              </div>
                            </div>
                            <p className="font-cormorant text-xs italic text-sepia">
                              This is a demo — no real payment will be processed.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <PaymentCard
                      selected={paymentMethod === 'cod'}
                      onSelect={() => setPaymentMethod('cod')}
                      icon={<Banknote className="h-5 w-5" strokeWidth={1.5} />}
                      label="Cash on Delivery"
                      description="Pay with cash when your order arrives"
                    />
                    <AnimatePresence>
                      {paymentMethod === 'cod' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-parchment border border-brass/20 p-4 ml-4">
                            <p className="font-cormorant text-sm italic text-sepia">
                              Please keep exact change ready. Our delivery partner will collect the payment in cash.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <VintageButton variant="outline" onClick={() => goToStep(0)}>
                      <ChevronLeft className="inline h-4 w-4 mr-1" />
                      Back
                    </VintageButton>
                    <VintageButton onClick={handleContinueToReview}>
                      Continue to Review
                      <ChevronRight className="inline h-4 w-4 ml-1" />
                    </VintageButton>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-playfair text-2xl font-bold text-ink">Review Your Order</h2>
                  <OrnamentDivider width="sm" className="self-start" />

                  {/* Address summary */}
                  <div className="bg-cream border border-brass/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 font-elite text-[10px] uppercase tracking-wider text-ink">
                        <MapPin className="h-4 w-4 text-brass" strokeWidth={1.5} />
                        Delivery Address
                      </span>
                      <button onClick={() => goToStep(0)} className="flex items-center gap-1 font-elite text-[10px] uppercase tracking-wider text-oxblood hover:text-ink transition-colors">
                        <Edit className="h-3 w-3" /> Edit
                      </button>
                    </div>
                    {deliveryData && (
                      <div className="font-lora text-sm text-ink/80">
                        <p className="font-playfair font-semibold text-ink">{deliveryData.name}</p>
                        <p>{deliveryData.addressLine}</p>
                        <p>{deliveryData.landmark && `${deliveryData.landmark}, `}{deliveryData.city} — {deliveryData.pincode}</p>
                        <p>{deliveryData.phone} · {deliveryData.email}</p>
                        {deliveryType === 'schedule' && selectedSlot && (
                          <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mt-1">
                            Scheduled for {selectedSlot}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payment summary */}
                  <div className="bg-cream border border-brass/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2 font-elite text-[10px] uppercase tracking-wider text-ink">
                        <Wallet className="h-4 w-4 text-brass" strokeWidth={1.5} />
                        Payment Method
                      </span>
                      <button onClick={() => goToStep(1)} className="flex items-center gap-1 font-elite text-[10px] uppercase tracking-wider text-oxblood hover:text-ink transition-colors">
                        <Edit className="h-3 w-3" /> Edit
                      </button>
                    </div>
                    <p className="font-lora text-sm text-ink/80">
                      {paymentMethod === 'upi' && `UPI — ${upiId || 'yourname@upi'}`}
                      {paymentMethod === 'card' && `Card ending ${cardNumber.replace(/\s/g, '').slice(-4) || '0000'}`}
                      {paymentMethod === 'cod' && 'Cash on Delivery'}
                    </p>
                  </div>

                  {/* Items summary */}
                  <div className="bg-cream border border-brass/30 p-4">
                    <span className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-3">
                      Items ({items.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.selectedAddOns.map(a => a.id).join(',')}`} className="flex justify-between font-lora text-sm text-ink/80">
                          <span>{item.quantity}× {item.name}</span>
                          <span className="flex items-center font-elite text-xs text-oxblood">
                            <IndianRupee className="h-3 w-3" />
                            {item.unitPrice * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Place order */}
                  <div className="flex gap-3 pt-4">
                    <VintageButton variant="outline" onClick={() => goToStep(1)}>
                      <ChevronLeft className="inline h-4 w-4 mr-1" />
                      Back
                    </VintageButton>
                    <VintageButton size="lg" onClick={handlePlaceOrder} disabled={placing}>
                      {placing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Placing Order...
                        </span>
                      ) : (
                        'Place Order'
                      )}
                    </VintageButton>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: sticky summary (desktop) */}
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-28">
            <CheckoutSummary items={items} pricing={pricing} />
          </div>
        </div>

        {/* Mobile: collapsible summary */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream border-t-2 border-brass shadow-vintage-lift">
          <button
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="flex items-center justify-between w-full px-4 py-3"
          >
            <span className="font-elite text-[10px] uppercase tracking-wider text-ink">
              {mobileSummaryOpen ? 'Hide Summary' : 'Show Summary'}
            </span>
            <span className="flex items-center font-elite text-lg text-oxblood">
              <IndianRupee className="h-4 w-4" />
              {pricing.grandTotal}
            </span>
          </button>
          <AnimatePresence>
            {mobileSummaryOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden px-4 pb-4"
              >
                <CheckoutSummary items={items} pricing={pricing} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Spacer for mobile fixed bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="font-elite text-[10px] uppercase tracking-wider text-ink block mb-1.5">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="font-elite text-[10px] text-oxblood mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function PincodeCheck({ pincode }: { pincode: string }) {
  if (pincode.length !== 6) return null;
  const zone = BANGALORE_PINCODES[pincode];
  if (zone) {
    return (
      <p className="font-elite text-[10px] text-forest mt-1">
        <Check className="inline h-3 w-3 mr-1" strokeWidth={2} />
        We deliver to {zone} — {pincode}
      </p>
    );
  }
  return (
    <p className="font-elite text-[10px] text-oxblood mt-1">
      We don't deliver there yet. We serve: {site.deliveryZones.join(', ')}
    </p>
  );
}

function PaymentCard({
  selected,
  onSelect,
  icon,
  label,
  description,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex items-center gap-3 w-full p-4 border-2 transition-colors text-left',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
        selected ? 'border-brass bg-cream shadow-vintage-card' : 'border-brass/20 bg-parchment hover:border-brass/40'
      )}
    >
      <div className={cn(
        'flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0',
        selected ? 'border-brass bg-brass' : 'border-brass/30'
      )}>
        {selected && <div className="h-2.5 w-2.5 rounded-full bg-cream" />}
      </div>
      <div className="text-brass">{icon}</div>
      <div className="flex-1">
        <p className="font-playfair text-sm font-semibold text-ink">{label}</p>
        <p className="font-cormorant text-xs italic text-sepia">{description}</p>
      </div>
    </button>
  );
}

function CheckoutSummary({
  items,
  pricing,
}: {
  items: ReturnType<typeof useCart.getState>['items'];
  pricing: ReturnType<typeof useCart.getState>['getPricing'] extends () => infer P ? P : never;
}) {
  return (
    <div className="bg-cream border border-brass/30 shadow-vintage-card p-5 space-y-3">
      <h3 className="font-playfair text-lg font-bold text-ink">Order Summary</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.id}-${item.selectedAddOns.map(a => a.id).join(',')}`} className="flex justify-between font-lora text-xs text-ink/80">
            <span className="truncate mr-2">{item.quantity}× {item.name}</span>
            <span className="flex items-center font-elite text-xs text-oxblood shrink-0">
              <IndianRupee className="h-3 w-3" />
              {item.unitPrice * item.quantity}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-1.5 border-t border-brass/20 pt-3">
        <SummaryRow label="Subtotal" value={pricing.subtotal} />
        {pricing.discount > 0 && <SummaryRow label="Discount" value={-pricing.discount} color="text-forest" />}
        <SummaryRow label="Delivery" value={pricing.deliveryFee} suffix={pricing.freeDelivery ? ' Free' : undefined} />
        <SummaryRow label="GST (5%)" value={pricing.gst} />
      </div>
      <div className="flex items-center justify-between border-t border-brass/20 pt-2">
        <span className="font-elite text-sm uppercase tracking-wider text-ink">Total</span>
        <span className="flex items-center font-elite text-2xl text-oxblood">
          <IndianRupee className="h-5 w-5" />
          {pricing.grandTotal}
        </span>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  suffix,
  color = 'text-sepia',
}: {
  label: string;
  value: number;
  suffix?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-elite text-[10px] uppercase tracking-wider text-sepia">{label}</span>
      <span className={cn('flex items-center font-elite text-xs', color)}>
        <IndianRupee className="h-3 w-3" />
        {value}
        {suffix && <span className="ml-1 text-forest">{suffix}</span>}
      </span>
    </div>
  );
}
