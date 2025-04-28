"use client";

import { UnipileContext } from "@/provider/unipile-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Mails } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthToken } from "@convex-dev/auth/react";

export function SiteHeader() {
  const unipile = useContext(UnipileContext);
  const token = useAuthToken();

  const getHostedAuth = async () => {
    if (!token) {
      console.error("JWT not found");
      return;
    }

    const jwt = jwtDecode(token);
    const userId = jwt.sub?.split("|").at(0) as string;

    const req = await fetch("/api/unipile/hosted_auth", {
      method: "POST",
      body: JSON.stringify({ userId: userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!req.ok) {
      throw new Error("Failed to generate URL for Unipile hosted Gmail Auth.");
    }

    const res = (await req.json()) as { url: string };

    if (!res.url) {
      throw new Error("No redirect url returned from server");
    }

    window.location.assign(res.url);
  };

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="ml-auto">
          {unipile.isConnected === false && (
            <Button variant="default" size="sm" onClick={() => getHostedAuth()}>
              <Mails className="mr-1" />
              Connect gmail
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
