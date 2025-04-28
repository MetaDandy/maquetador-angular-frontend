'use client'

import useAppStore from "@/lib/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const Alert = () => {
  const { alert } = useAppStore();

  if (!alert) return null;

  return (
    <AlertDialog open={alert.isOpen}>
      <AlertDialogContent asChild>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert.title}</AlertDialogTitle>
            <AlertDialogDescription>{alert.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alert.btnCancel && (
              <AlertDialogCancel asChild>{alert.btnCancel}</AlertDialogCancel>
            )}
            {alert.btnAction && (
              <AlertDialogAction asChild>{alert.btnAction}</AlertDialogAction>
            )}
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default Alert;