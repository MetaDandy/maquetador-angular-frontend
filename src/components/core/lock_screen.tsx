"use client";

import useAppStore from "@/lib/store";
import { Repeat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom";

const LockScreen = () => {
  const { lockScreen } = useAppStore();

  if (!lockScreen) return null;

  let renderContent;

  switch (lockScreen.type) {
    case "jsx":
      renderContent = lockScreen.content;
      break;

    case "reload":
      renderContent = (
        <div className="flex flex-col items-center justify-center">
          <div className="my-3 text-center font-bold">
            <button type="button" className="flex items-center gap-2 text-white">
              <Repeat className="h-4 w-4" />
              Recargar la página
            </button>
          </div>
        </div>
      );
      break;

    case "loading":
      renderContent = (
        <div className="flex flex-col items-center justify-center">
          <div className="border-2 h-16 w-16 animate-spin rounded-full border-t-blue-400/70 border-t-2 border-gray-300/50"></div>
          <div className="mt-5 text-center font-bold text-white">{lockScreen.content}</div>
        </div>
      );
      break;

    default:
      renderContent = null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lockscreen-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          key="lockscreen-content"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-xl bg-white/10 backdrop-blur-md p-6 text-white shadow-xl"
        >
          {renderContent}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body    
  );
};

export default LockScreen;
