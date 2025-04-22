import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn("bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow transition", className)}
      {...props}
    />
  );
}
