"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  // Don't show top-left header on the very first screen, inside the dashboard, or creator signup
  if (pathname === "/" || pathname?.startsWith("/dashboard") || pathname === "/become-creator") return null;
  
  return (
    <header className="absolute top-0 left-0 w-full p-4 sm:p-6 flex items-center z-50">
      <img src="/logo.png" alt="Rheodemy" className="h-20 sm:h-24 w-auto object-contain drop-shadow-md" />
    </header>
  );
}
