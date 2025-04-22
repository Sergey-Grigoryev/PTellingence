import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn("border rounded-xl px-3 py-2 w-full shadow-sm focus:outline-none focus:ring focus:border-blue-300", className)}
      rows="4"
      {...props}
    />
  );
}
