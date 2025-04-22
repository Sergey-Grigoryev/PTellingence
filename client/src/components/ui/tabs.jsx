import React, { useState } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const context = { activeTab, setActiveTab };
  return (
    <div>
      {children.map((child, index) =>
        React.cloneElement(child, { context, key: index })
      )}
    </div>
  );
}

export function TabsList({ children, context }) {
  return (
    <div className="flex gap-2">
      {children.map((child, index) =>
        React.cloneElement(child, { context, key: index })
      )}
    </div>
  );
}

export function TabsTrigger({ value, children, context }) {
  const isActive = context.activeTab === value;
  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "px-4 py-2 rounded-xl",
        isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, context }) {
  if (context.activeTab !== value) return null;
  return <div className="mt-4">{children}</div>;
}