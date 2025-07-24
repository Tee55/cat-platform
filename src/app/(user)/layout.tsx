"use client";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/CustomTheme";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function MainLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <TRPCReactProvider>
      <ThemeProvider>
        <SessionProvider session={session}>
          <SidebarProvider className="flex flex-col">
            <SiteHeader />
            <AppSidebar />
            <SidebarInset>
              <main>{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </SessionProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
