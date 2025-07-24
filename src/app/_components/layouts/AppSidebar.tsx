"use client";

import {
  AlertTriangleIcon,
  BookIcon,
  Search,
  TerminalIcon,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCustomTheme } from "@/components/CustomTheme";
import { Flex } from "@radix-ui/themes";
import type { MenuType } from "@/shared/types";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const router = useRouter();
  const { toggleTheme, theme } = useCustomTheme();
  const { state } = useSidebar();

  const menus: MenuType[] = [
    {
      label: "Dashboard",
      icon: () => <TerminalIcon />,
      onClick: () => void router.push("/vulnerability-dashboard"),
    },
    {
      label: "Vulnerability Scan",
      icon: () => <Search />,
      onClick: () => void router.push("/calendar/0"),
    },
    {
      label: "Threat Intelligence",
      icon: () => <BookIcon />,
      onClick: () => {
        // Add action or navigation here if needed
      },
    },
    {
      label: "CVE Search",
      icon: () => <Search />,
      onClick: () => void router.push("/cve-search"),
    },
    {
      label: "Critical Alerts",
      icon: () => <AlertTriangleIcon />,
      onClick: () => {
        // Add action or navigation here if needed
      },
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <Flex align="center" gap="2" className="px-4 py-3">
          <Menu className="h-5 w-5" />
          {state !== "collapsed" && (
            <span className="font-semibold text-sidebar-foreground">
              Security Dashboard
            </span>
          )}
        </Flex>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                  >
                    <button
                      type="button"
                      onClick={item.onClick}
                      className="flex items-center space-x-2 w-full"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Toggle Theme"
            >
              <button
                type="button"
                onClick={() => toggleTheme()}
                className="flex items-center space-x-2 w-full"
              >
                {theme === "dark" ? <Sun /> : <Moon />}
                <span>Toggle Theme</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}