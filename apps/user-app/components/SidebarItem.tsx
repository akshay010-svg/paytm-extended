"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <button
      type="button"
      aria-current={selected ? "page" : undefined}
      className={`flex w-full cursor-pointer p-2 pl-8 text-left ${
        selected ? "text-[#6a51a6]" : "text-slate-500"
      }`}
      onClick={() => router.push(href)}
    >
      <div className="pr-2">{icon}</div>
      <div className="font-bold">{title}</div>
    </button>
  );
};