"use client";

import { SubscriptionTable } from "@/components/subscriptions-table";
import { api } from "@/convex/_generated/api";
import { UnipileContext } from "@/provider/unipile-context";
import { usePaginatedQuery } from "convex/react";
import { useContext } from "react";

export default function Page() {
  const unipile = useContext(UnipileContext);
  const { results, status, loadMore } = usePaginatedQuery(
    api.subscriptions.list,
    unipile.userId ? { userId: unipile.userId } : "skip",
    {
      initialNumItems: 5,
    }
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="px-4 py-3">
          <h2 className="text-lg font-medium">Subscription emails.</h2>
        </div>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* @ts-ignore */}
          <SubscriptionTable data={results} />
        </div>
      </div>
    </div>
  );
}
