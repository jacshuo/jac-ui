import React from "react";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-primary-500 dark:text-primary-400">{title}</h3>
      {children}
    </section>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-6 text-2xl font-bold text-primary-800 dark:text-primary-100">{children}</h1>
  );
}
