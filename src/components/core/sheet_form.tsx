"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import useAppStore from "@/lib/store";
import { ScrollArea } from "../ui/scroll-area";

export function SheetForm() {
    const { sheet, setSheet } = useAppStore();

    if (!sheet) return null;

    const {
        isOpen,
        title,
        content,
        btnAction,
        btnCancel,
        side = "right"
    } = sheet;

    return (
        <Sheet open={isOpen} onOpenChange={() => setSheet(false)}>
            <SheetContent side={side}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-auto w-auto ">
                    <div className="flex items-center space-x-2">{content}</div>
                </ScrollArea>
                <SheetFooter>
                    {btnCancel && (
                        <SheetClose asChild>{btnCancel}</SheetClose>
                    )}
                    {btnAction && <>{btnAction}</>}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
