"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <div className="flex items-center py-1 text-lg font-medium gap-4">
          <Image
            src={'/logo.svg'}
            width={36}
            height={36}
            alt='logo'
          />
          <h1>Data Flow</h1>
        </div>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/builder"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/builder" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Builder
        </Link>
      </nav>
    </div>
  );
}

export function SiteNav({ className }: { className?: string }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "absolute top-0 z-[3] flex w-full items-center justify-between bg-transparent px-6 py-4 backdrop-blur-md",
        className,
        pathname === "/flow" ? "border-b bg-background backdrop-blur-none" : "",
        pathname.startsWith("/auth/login")
          ? "bg-transparent backdrop-blur-none"
          : "",
      )}
    >
      <MainNav />
      {session ? (
        <div className="flex flex-row items-center gap-4">
          <span className="text-sm font-medium text-foreground">
            {`${session?.user?.name}`}
          </span>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? ""}
            />
            <AvatarFallback className="text-sm font-medium">
              {session?.user?.name?.split(" ").map((n) => n[0])}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div>
          <Link
            href="/auth/login"
            className={cn(
              "border",
              buttonVariants({ variant: "ghost" }),
              pathname.startsWith("/auth/login") ?? "hidden",
            )}
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
