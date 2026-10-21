import { type JSX } from "react";
import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-2 border-b border-slate-200 pb-2 text-xl">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}
