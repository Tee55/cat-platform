"use client";

import * as React from "react";
import {
  IconDashboard,
  IconInnerShadowTop,
  IconNews,
  IconSearch,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Flex } from "@radix-ui/themes";

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
        title: "CVE Search",
        onClick: () => router.push("/cve-search"),
        icon: IconSearch,
      },
      {
        title: "News Search",
        onClick: () => router.push("/news-search"),
        icon: IconNews,
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
                <span className="text-base font-semibold">GrowPro</span>
                <SidebarTrigger className="ml-auto"/>
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
