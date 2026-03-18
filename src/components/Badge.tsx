import React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { badgeVariants } from "../styles/theme";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ intent, size, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ intent, size }), className)} {...props} />;
}
