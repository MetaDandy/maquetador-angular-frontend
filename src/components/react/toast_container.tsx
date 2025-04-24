// src/components/ToastContainer.tsx
import { useEffect, useState } from 'react';

type ToastDetail = {
  message: string | React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
};

declare global {
  interface WindowEventMap {
    toast: CustomEvent<ToastDetail>;
  }
}

type Toast = {
  id: number;
  message: string | React.ReactNode;
  variant: 'info' | 'success' | 'warning' | 'error';
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (e: CustomEvent<ToastDetail>) => {
      const { message, variant = 'info' } = e.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, variant }]);
      setTimeout(() => removeToast(id), 5000);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);

  const removeToast = (id: number) =>
    setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed top-8 inset-x-0 flex flex-col items-center gap-4 z-50">
      {toasts.map(({ id, message, variant }) => (
        <div
          key={id}
          role="alert"
          className={`
            alert alert-${variant}
            shadow-lg
            w-[90%] max-w-md
            text-lg
            flex items-center
            `}
        >
          {variant === 'warning' && (
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856
                   c1.54 0 2.502-1.667 1.732-3L13.732 4
                   c-.77-1.333-2.694-1.333-3.464 0L3.34 16
                   c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {variant === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2
                   m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="flex-1">{message}</span>
          <button
            className="btn btn-sm btn-ghost ml-4"
            onClick={() => removeToast(id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

