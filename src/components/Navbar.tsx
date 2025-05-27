import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";

const routeList = [
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "#faq", label: "FAQ" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";

  // State to track current hash for highlighting hash links
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    if (!isHome) return; // Only track hash changes on the home page

    const onHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [isHome]);

  // Helper to determine if a link is active
  const isActiveLink = (href: string) => {
    if (href.startsWith("#")) {
      // For hash links, active if on home and current hash matches href
      return isHome && currentHash === href;
    } else {
      // For route links, active if location.pathname matches href exactly
      return location.pathname === href;
    }
  };

  // Green background styling for Back to Home button when active
  const activeBackHomeClass = "bg-green-500 text-white rounded px-2 py-1";

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <Link to="/" className="ml-2 font-bold text-1xl flex">
              <LogoIcon />
              PowerSense
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" />
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Menu</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {/* Show only Dashboard on /dashboard */}
                  {isDashboard ? (
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={`${buttonVariants({ variant: "ghost" })} ${
                        isActiveLink("/") ? activeBackHomeClass : ""
                      }`}
                    >
                      Back to Home
                    </Link>
                  ) : (
                    routeList.map(({ href, label }) => {
                      const isHash = href.startsWith("#");
                      const activeClass = isActiveLink(href)
                        ? "text-green-500 font-semibold"
                        : "";
                      return isHash && isHome ? (
                        <a
                          key={label}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className={`${buttonVariants({
                            variant: "ghost",
                          })} ${activeClass}`}
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          key={label}
                          to={href}
                          onClick={() => setIsOpen(false)}
                          className={`${buttonVariants({
                            variant: "ghost",
                          })} ${activeClass}`}
                        >
                          {label}
                        </Link>
                      );
                    })
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {isDashboard ? (
              <Link
                to="/"
                className={`text-[17px] ${buttonVariants({ variant: "ghost" })} ${
                  isActiveLink("/") ? activeBackHomeClass : ""
                }`}
              >
                Back to Home
              </Link>
            ) : (
              routeList.map(({ href, label }) => {
                const isHash = href.startsWith("#");
                const activeClass = isActiveLink(href)
                  ? "text-green-500 font-semibold"
                  : "";
                return isHash && isHome ? (
                  <a
                    key={label}
                    href={href}
                    className={`text-[17px] ${buttonVariants({
                      variant: "ghost",
                    })} ${activeClass}`}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={label}
                    to={href}
                    className={`text-[17px] ${buttonVariants({
                      variant: "ghost",
                    })} ${activeClass}`}
                  >
                    {label}
                  </Link>
                );
              })
            )}
          </nav>

          {/* GitHub and toggle */}
          <div className="hidden md:flex gap-2">
            {!isDashboard && (
              <a
                href="https://github.com/LoneTerror"
                target="_blank"
                rel="noreferrer"
                className={`border ${buttonVariants({ variant: "secondary" })}`}
              >
                <GitHubLogoIcon className="mr-2 w-5 h-5" />
                Github
              </a>
            )}
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
