"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { signOut } = useAuthActions();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Button
          variant="outline"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
          onClick={() => signOut()}
        >
          <LogOutIcon />
          Sign out
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
