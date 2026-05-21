"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import Axios from "@/lib/axiosPrivate";

import { cn } from "@/lib/utils";
import useAuth from "@/app/hooks/useAuth";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export const LogoutButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const { setAuth } = useAuth();
    const router = useRouter();

    const Comp = asChild ? Slot : "button";

    const onClick = async () => {
      try {
        await Axios().post("/auth/logout"); // safer than GET
      } catch (err) {
        console.log("Logout request failed, continuing...");
      }

      // Clear auth state completely
      setAuth(null);

      // Redirect to home
      router.push("/");
    };

    return (
      <Comp
        ref={ref}
        onClick={onClick}
        className={cn(
          "w-full text-muted-foreground cursor-pointer",
          buttonVariants({ variant, size, className }),
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

LogoutButton.displayName = "LogoutButton";
