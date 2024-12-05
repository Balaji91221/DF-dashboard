'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, BarChart2, HelpCircle,  Shield } from 'lucide-react';

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { title: 'Users', icon: Users, href: '/users' },
  { title: 'Analytics', icon: BarChart2, href: '/analytics' },
  { title: 'Help', icon: HelpCircle, href: '/help' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    setIsCollapsed(savedState === 'true');
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  return (
    <div className={cn(
      "relative flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "")}>
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          {!isCollapsed && <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MAuthN</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("absolute right-2 top-4", isCollapsed ? "-right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full" : "")}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-1 py-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300",
                  isCollapsed ? "px-2" : "px-4"
                )}
              >
                <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto p-4">
        <nav className="flex flex-col gap-1">
          {/* <Button variant="ghost" className={cn("w-full justify-start", isCollapsed ? "px-2" : "px-4")}>
            <Settings className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
            {!isCollapsed && <span>Settings</span>}
          </Button> */}
          {/* <Button variant="ghost" className={cn("w-full justify-start", isCollapsed ? "px-2" : "px-4")}>
            <LogOut className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
            {!isCollapsed && <span>Logout</span>}
          </Button> */}
          <p>Built a website for MAuthN ©.</p>
          
        </nav>
      </div>
    </div>
  );
}

