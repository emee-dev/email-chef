import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="w-[200px]">
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
