"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Renders the leading lock icon used by the sign-in, admin and register forms. */
  withLockIcon?: boolean;
  /** Colour classes for the lock and eye icons — the admin form is dark themed. */
  iconClassName?: string;
};

export default function PasswordInput({
  className,
  withLockIcon = false,
  iconClassName = "text-gray-400",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      {withLockIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className={cn("h-5 w-5", iconClassName)} />
        </div>
      )}
      <input
        {...props}
        type={visible ? "text" : "password"}
        // Plain concatenation, not cn(): callers pass `pl-10 px-3`, and tailwind-merge would
        // drop the pl-10 they rely on. Tailwind emits pr/pl after px, so both still win here.
        className={[className, "pr-10"].filter(Boolean).join(" ")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 right-0 pr-3 flex items-center transition-opacity hover:opacity-70",
          iconClassName,
        )}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
