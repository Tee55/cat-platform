"use client";

import * as React from "react";
import {
  IconDashboard,
  IconInnerShadowTop,
  IconNews,
  IconSearch,
  IconUpload,
} from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Flex } from "@radix-ui/themes";

import { NavUser } from "@/components/nav-user";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// NavMain Component
interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  isActive?: boolean;
  items?: NavItem[];
}

interface NavMainProps {
  items: NavItem[];
  label?: string;
}

function NavMain({ items, label }: NavMainProps) {
  return (
    <>
      {items.map((item) => {
        // If item has sub-items, render as collapsible group
        if (item.items && item.items.length > 0) {
          return (
            <Collapsible
              key={item.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm w-full flex items-center px-3 py-2 rounded-md cursor-pointer">
                    {item.icon && <item.icon className="size-4 mr-2" />}
                    {item.title}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton 
                            asChild={!!subItem.url}
                            onClick={subItem.onClick}
                            isActive={subItem.isActive}
                          >
                            {subItem.url ? (
                              <a href={subItem.url} className="flex items-center gap-2">
                                {subItem.icon && <subItem.icon className="size-4" />}
                                <span>{subItem.title}</span>
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 cursor-pointer">
                                {subItem.icon && <subItem.icon className="size-4" />}
                                <span>{subItem.title}</span>
                              </div>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        }

        // Regular navigation item
        return (
          <SidebarGroup key={item.title}>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild={!!item.url}
                    onClick={item.onClick}
                    isActive={item.isActive}
                  >
                    {item.url ? (
                      <a href={item.url} className="flex items-center gap-2">
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 cursor-pointer">
                        {item.icon && <item.icon className="size-4" />}
                        <span>{item.title}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}

// AppSidebar Component
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Vulnerability Dashboard",
        onClick: () => router.push("/vulnerability-dashboard"),
        icon: IconDashboard,
      },
      {
        title: "Threat Intelligence",
        icon: IconSearch,
        items: [
          {
            title: "CVE Search",
            url: "/cve-search",
            icon: IconSearch,
          },
          {
            title: "News Search",
            url: "/news-search",
            icon: IconNews,
          },
        ],
      },
      {
        title: "Upload File",
        onClick: () => router.push("/upload-file"),
        icon: IconUpload,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Flex>
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold ml-2">GrowPro</span>
                <SidebarTrigger className="ml-auto" />
              </Flex>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}