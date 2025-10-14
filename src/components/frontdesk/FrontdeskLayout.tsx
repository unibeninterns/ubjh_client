
"use client"

import type React from "react"
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, withFrontdeskAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/frontdesk/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    href: "/frontdesk/bookings",
    icon: BookOpen,
  },
  {
    name: "Guests",
    href: "/frontdesk/guests",
    icon: Users,
  },
];

const bottomItems = [
  {
    name: "Settings",
    href: "/frontdesk/settings",
    icon: Settings,
  },
];

interface FrontdeskLayoutProps {
  children: React.ReactNode
}

function FrontdeskLayoutComponent({ children }: FrontdeskLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const menuButton = document.getElementById('mobile-menu-button')

      if (isMobileMenuOpen &&
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          menuButton &&
          !menuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    };
  }, [isMobileMenuOpen]);

  const logoutItem = {
    name: "Logout",
    action: handleLogout,
    icon: LogOut,
  };

  return (
    <div className="flex h-screen bg-[#FAF6F3]">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#222540] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/iconn.png"
              width={56}
              height={56}
              alt="AuztinTech logo"
              className="h-8 w-10"
            />
            <span className="text-lg text-white md:text-2xl font-extrabold pt-3 tracking-wide">AuztinTech</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 h-8 w-8 text-white hover:bg-[#35395BD9]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#35395BD9] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.first_name?.charAt(0) || user.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.email
                  }
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Frontdesk
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between p-3">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "bg-[#35395BD9] text-[#F7DE8E]" : "text-white hover:bg-[#35395BD9]"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <nav className="space-y-2">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "bg-[#35395BD9] text-[#F7DE8E]" : "text-white hover:bg-[#35395BD9]"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                logoutItem.action()
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left text-white hover:bg-[#35395BD9]"
            >
              <logoutItem.icon className="h-5 w-5 flex-shrink-0" />
              <span>{logoutItem.name}</span>
            </button>
          </nav>
        </div>
      </div>

      <div
        className={cn(
          "hidden lg:flex bg-[#222540] border-r border-gray-700 flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-48"
        )}
      >
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <Image
                src="/iconn.png"
                width={56}
                height={56}
              alt="AuztinTech logo"
                className="h-8 w-10"
              />
            <span className="text-lg text-white md:text-2xl font-extrabold pt-3 tracking-wide">AuztinTech</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 h-8 w-8 text-white hover:bg-[#35395BD9]">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {!isCollapsed && user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#35395BD9] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.first_name?.charAt(0) || user.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.email
                  }
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Frontdesk
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between p-3">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "bg-[#35395BD9] text-[#F7DE8E]" : "text-white hover:bg-[#35395BD9]",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          <nav className="space-y-2">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    isActive ? "bg-[#35395BD9] text-[#F7DE8E]" : "text-white hover:bg-[#35395BD9]",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              )
            })}

            <button
              onClick={logoutItem.action}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left",
                "text-white hover:bg-[#35395BD9]",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? logoutItem.name : undefined}
            >
              <logoutItem.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{logoutItem.name}</span>}
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden bg-[#FFFFFF] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            id="mobile-menu-button"
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#222540] p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <Image
              src="/iconn.png"
              width={56}
              height={56}
              alt="AuztinTech logo"
              className="h-8 w-10"
            />
            <span className="text-lg text-[#222540] md:text-2xl font-extrabold pt-3 tracking-wide">AuztinTech</span>
          </div>
          <div className="w-10 h-8 flex items-center justify-end">
            {user && (
              <div className="w-8 h-8 bg-[#35395BD9] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {user.first_name?.charAt(0) || user.email?.charAt(0) || 'A'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}

export const FrontdeskLayout = withFrontdeskAuth(FrontdeskLayoutComponent);
