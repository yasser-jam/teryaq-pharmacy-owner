"use client";

import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
const iconVariants = cva("mx-auto size-16", {
  variants: {
    variant: {
      default: "",
      destructive: "text-destructive",
      secondary: "text-secondary",
      primary: "text-primary",
      tertiary: "text-tertiary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export default function AlertDialog({
  children,
  Icon,
  open = false,
  loading,
  title,
  subtitle,
  action = "Continue",
  variant = "default",
  onAction,
  onOpenChange,
  className
}: {
  children?: React.ReactNode;
  Icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
  >;
  open?: boolean;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  action?: string;
  variant?: "default" | "destructive" | "secondary" | "tertiary";
  onAction?: () => void;
  onOpenChange?: (open: boolean) => void;
  className?: string
}) {
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) onOpenChange(open);
  };

  const t = useTranslations('Common')

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("max-w-96!", className)}>
        <DialogHeader>
          <Icon className={cn(iconVariants({ variant }))} />
          {title ? (
            <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          ) : null}
          {subtitle ? (
            <DialogDescription className="text-center">
              {subtitle}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter className="justify-center!">
          <Button
            onClick={() => (onOpenChange ? onOpenChange(false) : false)}
            variant="outline"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={() => (onAction ? onAction() : null)}
            variant={
              (["default", "destructive", "secondary", 'tertiary'].includes(variant)
                ? variant
                : "default") as any
            }
            loading={loading}
          >
            {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
