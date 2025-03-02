"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardIcon,
  CogIcon,
  PlusIcon,
  DocumentIcon,
  ChartBarIcon,
  HomeIcon,
  UserGroupIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { DashboardNavProps } from "@/components/types/survey";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const userNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: HomeIcon
      },
      {
        name: "My Responses",
        href: "/dashboard/responses",
        icon: ClipboardIcon,
        badge: 3 // Example badge for new responses
      }
    ]
  },
  {
    title: "Account",
    items: [
      {
        name: "Notifications",
        href: "/dashboard/notifications",
        icon: BellIcon,
        badge: 2
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: CogIcon
      }
    ]
  }
];

const adminNavSections: NavSection[] = [
  {
    title: "Surveys",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: HomeIcon
      },
      {
        name: "Create Survey",
        href: "/admin/createsurvey",
        icon: PlusIcon
      },
      {
        name: "My Surveys",
        href: "/admin/surveys",
        icon: DocumentIcon,
        badge: 5
      }
    ]
  },
  {
    title: "Analysis",
    items: [
      {
        name: "Responses",
        href: "/admin/responses",
        icon: ClipboardIcon
      },
      {
        name: "Analytics",
        href: "/admin/analytics",
        icon: ChartBarIcon
      }
    ]
  },
  {
    title: "Administration",
    items: [
      {
        name: "User Management",
        href: "/admin/users",
        icon: UserGroupIcon
      },
      {
        name: "Settings",
        href: "/admin/settings",
        icon: CogIcon
      }
    ]
  }
];

export default function DashboardNav({ userData }: DashboardNavProps) {
  const pathname = usePathname();
  const navSections = userData?.role === 'admin' ? adminNavSections : userNavSections;

  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="space-y-8">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-itg-red text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${
                        isActive 
                          ? 'bg-white text-itg-red' 
                          : 'bg-itg-red text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}