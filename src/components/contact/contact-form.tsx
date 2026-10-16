'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Stamp } from '@/components/ui/stamp';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { VintageButton } from '@/components/ui/vintage-button';
import { cn } from '@/lib/utils';

const TOPICS = [
  'General Enquiry',
  'Order Issue',
  'Catering and Bulk Orders',
  'Feedback',
  'Partnerships',
] as const;

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  topic: z.string().min(1, 'Please select a topic'),
  orderId: z.string().optional(),
  message: z.string().min(10, 'Please tell us a bit more').max(500, 'Keep it under 500 characters'),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const prefersReduced = useReducedMotion();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: '', message: '' },
  });

  const topic = watch('topic');
  const message = watch('message') || '';
  const showOrderId = topic === 'Order Issue';

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast({
      title: 'Letter sent!',
      description: `Thank you, ${data.name.split(' ')[0]}. We'll be in touch shortly.`,
    });
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="bg-parchment paper-texture border-2 border-brass/40 shadow-vintage-card p-8 flex flex-col items-center text-center">
        {/* Envelope illustration */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative mb-6"
        >
          <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
            {/* Envelope body */}
            <rect x="4" y="10" width="72" height="46" fill="#FBF6EA" stroke="#B08A3E" strokeWidth="2" />
            {/* Flap (animated closed) */}
            <motion.path
              d="M4 12L40 38L76 12"
              fill="none"
              stroke="#B08A3E"
              strokeWidth="2"
              initial={prefersReduced ? { opacity: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.path
              d="M4 10L40 36L76 10"
              fill="#F4EBD9"
              stroke="#B08A3E"
              strokeWidth="2"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
          </svg>
        </motion.div>

        <Stamp label="SENT" size="md" color="forest" className="mb-4" />

        <h3 className="font-playfair text-xl font-bold text-ink mb-2">Letter Sent!</h3>
        <p className="font-cormorant text-base italic text-sepia max-w-sm mb-6">
          Thank you for writing to us. We will reply to your letter faster than a hot tandoor cools.
        </p>

        <button
          onClick={handleReset}
          className="font-elite text-[10px] uppercase tracking-wider text-oxblood border border-brass/40 px-4 py-2 hover:bg-brass/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-parchment paper-texture border-2 border-brass/40 shadow-vintage-card">
      {/* Stamped corner */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-dashed border-brass/40 font-elite text-sepia/60 rotate-[-8deg]">
          <span className="text-[7px] uppercase tracking-wider">H&E</span>
          <span className="text-[6px] uppercase">Post</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <p className="font-elite text-[10px] uppercase tracking-[0.3em] text-sepia">
            Hearth & Ember Dispatch
          </p>
          <h3 className="font-playfair text-xl font-bold text-ink mt-1">Send Us a Letter</h3>
          <OrnamentDivider width="sm" className="mx-auto mt-3" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Honeypot */}
          <input
            type="text"
            {...register('website')}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] opacity-0 pointer-events-none"
          />

          {/* Name */}
          <Field label="Name" error={errors.name?.message} required>
            <input
              type="text"
              {...register('name')}
              aria-invalid={!!errors.name}
              placeholder="Your full name"
              className="checkout-input"
            />
          </Field>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" error={errors.email?.message} required>
              <input
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                placeholder="you@example.com"
                className="checkout-input"
              />
            </Field>
            <Field label="Phone (optional)">
              <input
                type="tel"
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="checkout-input"
              />
            </Field>
          </div>

          {/* Topic dropdown */}
          <Field label="Topic" error={errors.topic?.message} required>
            <div className="relative">
              <select
                {...register('topic')}
                aria-invalid={!!errors.topic}
                className="checkout-input appearance-none pr-10 cursor-pointer"
              >
                <option value="">Select a topic...</option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brass pointer-events-none" strokeWidth={1.5} />
            </div>
          </Field>

          {/* Order ID (conditional) */}
          <AnimatePresence initial={false}>
            {showOrderId && (
              <motion.div
                initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Field label="Order ID" error={errors.orderId?.message}>
                  <input
                    type="text"
                    {...register('orderId')}
                    placeholder="HE-123456"
                    className="checkout-input"
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message */}
          <Field label="Message" error={errors.message?.message} required>
            <textarea
              {...register('message')}
              aria-invalid={!!errors.message}
              placeholder="Tell us what is on your mind..."
              rows={4}
              maxLength={500}
              className="checkout-input resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className={cn(
                'font-elite text-[9px]',
                message.length > 450 ? 'text-oxblood' : 'text-sepia/50'
              )}>
                {message.length}/500
              </span>
            </div>
          </Field>

          {/* Submit */}
          <div className="pt-2">
            <VintageButton
              type="submit"
              size="lg"
              disabled={submitting}
              className={cn('w-full', submitting && 'opacity-60 cursor-not-allowed')}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
                  Sending...
                </span>
              ) : (
                'Send Letter'
              )}
            </VintageButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <div>
      <label className="block font-elite text-[10px] uppercase tracking-wider text-sepia mb-1.5">
        {label}
        {required && <span className="text-oxblood ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="font-cormorant text-sm italic text-oxblood mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
