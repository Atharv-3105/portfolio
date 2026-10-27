import type { ReactNode } from "react";

export function Container({
  children,
  wide = false,
  className = "",
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 ${wide ? "max-w-[1280px]" : "max-w-[1180px]"} ${className}`}>
      {children}
    </div>
  );
}
