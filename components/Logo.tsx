import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight text-nw-blue",
        className
      )}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-nw-purple to-nw-green text-sm font-bold text-white shadow-md"
        aria-hidden
      >
        NW
      </span>
      <span className="text-lg">NexWork</span>
    </Link>
  );
}
