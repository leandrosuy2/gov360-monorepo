"use client";

import * as React from "react";
import { cn } from "@gov360/utils";

export interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}

export const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, error, rightElement, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
          <input
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009c3b]/30 focus-visible:border-[#009c3b]",
              error
                ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                : "border-slate-200 hover:border-slate-300",
              className,
            )}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {error && (
          <p id={`${props.id}-error`} className="text-xs font-medium text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
IconInput.displayName = "IconInput";
