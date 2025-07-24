"use client";

import * as React from "react";
import {
  IconAlertCircle,
  IconDashboard,
  IconInnerShadowTop,
  IconNews,
  IconScan,
  IconSearch,
  IconChevronRight,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { Button } from "@/components/ui/button";
import { useCustomTheme } from "@/components/CustomTheme";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { toggleTheme, theme } = useCustomTheme();
  const session = useSession();

  const data = {
    user: {
      name: "shadcn",
      email: session.data?.user?.email || "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        onClick: () => router.push("/dashboard"),
        icon: IconDashboard,
      },
      {
        title: "Vulnerability Scan",
        onClick: () => router.push("/vulnerability-dashboard"),
        icon: IconScan,
      },
      {
        title: "Critical Alert / Notify",
        onClick: () => router.push("/alert"),
        icon: IconAlertCircle,
      },
    ],
    navGroups: [
      {
        title: "Threat Intelligence",
        items: [
          {
            title: "CVE Search",
            url: "/cve-search",
            icon: IconSearch,
          },
          {
            title: "Campaigns",
            url: "/campaigns",
            icon: IconNews,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="mt-20">
        <NavMain items={data.navMain} />

        {data.navGroups.map((group) => (
          <Collapsible
            key={group.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm">
                  {group.title}
                  <IconChevronRight className="ml-2 h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a
                            href={item.url}
                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-3 py-2"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <>
                <IconSun className="mr-2 h-4 w-4" /> Light Mode
              </>
            ) : (
              <>
                <IconMoon className="mr-2 h-4 w-4" /> Dark Mode
              </>
            )}
          </Button>
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
