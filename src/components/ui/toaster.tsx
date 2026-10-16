'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={4000}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="border-brass/40 bg-parchment text-ink paper-texture">
            <div className="grid gap-1">
              {title && <ToastTitle className="font-playfair text-sm font-semibold text-ink">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="font-cormorant text-sm italic text-sepia">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-sepia hover:text-oxblood" />
          </Toast>
        );
      })}
      <ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[380px]" />
    </ToastProvider>
  );
}
