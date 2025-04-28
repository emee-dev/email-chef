"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UnipileIntegration } from "@/provider/unipile-context";
import { ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

function Provider({ children }: { children: ReactNode }) {
  const pathName = usePathname();

  return (
    <ConvexAuthNextjsProvider client={convex}>
      <ConvexProvider client={convex}>
        <UnipileIntegration>
          <QueryClientProvider client={queryClient}>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathName}
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                // transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </QueryClientProvider>
        </UnipileIntegration>
      </ConvexProvider>
    </ConvexAuthNextjsProvider>
  );
}

export default Provider;
