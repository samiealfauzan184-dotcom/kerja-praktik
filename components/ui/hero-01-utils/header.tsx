"use client";

import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavigationSection = {
  title: string;
  href: string;
  isActive?: boolean;
};

type HeaderProps = {
  navigationData: NavigationSection[];
};

export default function Header({ navigationData }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          Kuis<span className="text-emerald-600">SMK</span>
        </a>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationData.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                  href={item.href}
                  active={item.isActive}
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                >
                  {item.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="hidden rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 sm:inline-flex"
          >
            <a href="/login">Login</a>
          </Button>
          <Button
            asChild
            className="hidden rounded-full bg-emerald-500 text-white hover:bg-emerald-600 sm:inline-flex"
          >
            <a href="/daftar">Buat Akun</a>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navigationData.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                      item.isActive && "bg-accent/60"
                    )}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <a href="/login">Login</a>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  <a href="/daftar">Buat Akun</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}