'use client';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAppStore from "@/lib/store";
import { createPortal } from "react-dom";

export function Modal() {
    const { modal, setModal } = useAppStore();

    if (!modal) return null;

    return createPortal(
        <Dialog open={modal.isOpen} onOpenChange={() => setModal(false)}>
            <DialogPortal>
        {/* 1. La capa semitransparente que cubre todo */}
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* 2. Contenedor flex que centra el contenido */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>{modal.title}</DialogTitle>
              <DialogDescription>{modal.description}</DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] py-2">
              {modal.content}
            </ScrollArea>

            <DialogFooter className="space-x-2">
              {modal.btnCancel && (
                <DialogClose asChild>
                  {modal.btnCancel}
                </DialogClose>
              )}
              {modal.btnAction}
            </DialogFooter>
          </DialogContent>
        </div>
      </DialogPortal>
        </Dialog>,
    document.body 
    );
}