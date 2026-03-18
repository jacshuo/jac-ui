import React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { buttonVariants } from "../styles/theme";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ intent, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ intent, size }), className)} {...props} />;
}
