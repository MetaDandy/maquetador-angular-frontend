// src/components/react/Modal.tsx
import { type ReactNode, useState } from 'react';

interface ModalProps {
  trigger: ReactNode;
  title?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Modal({
  trigger,
  title,
  children,
  open: openProp,
  onOpenChange,
}: ModalProps) {
  const isControlled = openProp !== undefined && onOpenChange;
  const [uncontrolled, setUncontrolled] = useState(false);
  const isOpen = isControlled ? openProp! : uncontrolled;
  const setOpen = isControlled ? onOpenChange! : setUncontrolled;

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {trigger}
      </div>
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box relative">
          {/* botón de cierre */}
          <button
            onClick={() => setOpen(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>
          {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
          {children}
          <div className="modal-action">
            <button onClick={() => setOpen(false)} className="btn">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
