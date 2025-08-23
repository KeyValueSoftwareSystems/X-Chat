"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Bot, Brain, Settings, Users, FileText, X, Zap, Database, Target, Code } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const sidebarItems = [
  { icon: FileText, label: "Prompt", href: "/", active: false },
  // { icon: Zap, label: "Tools", href: "/tools", active: false },
  { icon: Brain, label: "Knowledge", href: "/knowledge", active: false },
  // { icon: Target, label: "Triggers", href: "/triggers", active: false },
  // { icon: Users, label: "Escalations", href: "/escalations", active: false },
  // { icon: Database, label: "Metadata", href: "/metadata", active: false },
  // { icon: Settings, label: "Variables", href: "/variables", active: false },
  { icon: Settings, label: "Slack Config", href: "/slack-config", active: false },
  { icon: Code, label: "Integrations", href: "/integrations" },

]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const getPageTitle = () => {
    const currentItem = sidebarItems.find((item) => item.href === pathname)
    return currentItem?.label || "Knowledge"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-sidebar transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-medium text-sm text-sidebar-foreground">Untitled agent</span>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            {sidebarItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href === "/knowledge" && pathname.startsWith("/knowledge"))
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-56">
        {/* Page content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
