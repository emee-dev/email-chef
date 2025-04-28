"use client";

import { FoldersTableFull } from "@/components/folders-table-full";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { DataModel } from "@/convex/_generated/dataModel";
import { getColorForDomain } from "@/lib/utils";
import { UnipileContext } from "@/provider/unipile-context";
import { useQuery } from "@tanstack/react-query";
import { usePaginatedQuery } from "convex/react";
import { ChevronDown, Loader2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

type FolderListObject = {
  object: "FolderList";
  items: GmailFolders[];
};

type GmailFolders = {
  nb_mails?: number | undefined;
  id: string;
  name: string;
  account_id: string;
  role:
    | "inbox"
    | "sent"
    | "archive"
    | "drafts"
    | "trash"
    | "spam"
    | "all"
    | "important"
    | "starred"
    | "unknown";
  provider_id: string;
  object: "Folder";
};

const AnalyticsPage: React.FC = () => {
  const unipile = useContext(UnipileContext);

  const { data, status, isLoading } = useQuery<FolderListObject["items"]>({
    queryKey: ["folders"],
    queryFn: async () => {
      const req = await fetch("/api/folder", {
        method: "POST",
        body: JSON.stringify({
          userId: unipile.userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!req.ok) {
        return Promise.reject("Error fetching gmail folders");
      }

      const res = (await req.json()) as FolderListObject;

      if (!res || !res.items) {
        return Promise.resolve([] as FolderListObject["items"]);
      }

      return Promise.resolve(res.items);
    },
  });

  useEffect(() => {
    if (data) {
      console.log("data: ", data);
    }
  }, [data]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="grid grid-cols-3 gap-3 px-5">
            <DomainTypes userId={unipile.userId} />
            <EmailTypes userId={unipile.userId} />
          </div>

          <FoldersTableFull data={data} />
        </div>
      </div>
    </div>
  );
};

type DomainAnalytics = DataModel["domains"]["document"];
type CategoryAnalytics = DataModel["categories"]["document"];

// @ts-expect-error
const sortArr = <T,>(arr: T[]) => arr.sort((a, b) => b.count - a.count);

const DomainTypes = (props: { userId: string }) => {
  const [listDomains, setListDomains] = useState<DomainAnalytics[]>([]);

  const { results, isLoading, loadMore } = usePaginatedQuery(
    api.webhook.listDomainAnalytics,
    props.userId
      ? {
          userId: props.userId,
        }
      : "skip",
    { initialNumItems: 3 }
  );

  useEffect(() => {
    if (results) {
      const sortedArr = sortArr(results);
      setListDomains(sortedArr);
    }
  }, [results]);

  return (
    <div className="col-span-3 md:col-span-1 space-y-3 border rounded-lg p-4 shadow-sm">
      <h3 className="font-medium text-sm">Domains that email you most</h3>
      <div className="grid gap-1">
        {listDomains.map((domain, index) => {
          const colorClass = getColorForDomain(domain.service_url);
          return (
            <div
              key={domain._id}
              className="flex items-center justify-between p-1 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2 relative overflow-hidden w-[229px] max-w-[230px]">
                <div
                  style={{
                    width: domain.count,
                  }}
                  className={`h-full border min-h-[1.8rem] rounded-l-md ${colorClass.split(" ")[0]}`}
                ></div>
                <span className="text-sm absolute font-medium truncate max-w-[100px]">
                  {domain.service_url}
                </span>
              </div>
              <div className={`text-sm font-bold ${colorClass.split(" ")[1]}`}>
                {domain.count}
              </div>
            </div>
          );
        })}
      </div>
      {status !== "CanLoadMore" && (
        <Button className="w-full text-sm" size="sm" disabled variant="ghost">
          <span className="flex items-center">
            Unable to load more <ChevronDown className="ml-2 h-4 w-4" />
          </span>
        </Button>
      )}

      {status === "Exhausted" && (
        <Button className="w-full text-sm" size="sm" disabled variant="ghost">
          <span className="flex items-center">
            Exhausted <ChevronDown className="ml-2 h-4 w-4" />
          </span>
        </Button>
      )}

      {status === "CanLoadMore" && (
        <Button
          className="w-full text-sm"
          size="sm"
          variant="ghost"
          onClick={() => loadMore(2)}
        >
          {!isLoading ? (
            <span className="flex items-center">
              Show more <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              Loading <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

const EmailTypes = (props: { userId: string }) => {
  const [listCategories, setListCategories] = useState<CategoryAnalytics[]>([]);

  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.webhook.listCategoryAnalytics,
    props.userId
      ? {
          userId: props.userId,
        }
      : "skip",
    { initialNumItems: 3 }
  );

  useEffect(() => {
    if (results) {
      const sortedArr = sortArr(results);
      setListCategories(sortedArr);
    }
  }, [results]);

  return (
    <div className="col-span-3 md:col-span-1 space-y-3 border rounded-lg p-4 shadow-sm">
      <h3 className="font-medium text-sm">Types of email you are recieving</h3>
      <div className="space-y-3">
        {listCategories.map((domain, index) => {
          const colorClass = getColorForDomain(domain.emailId);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClass}`}
                >
                  {domain.emailId.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{domain.emailId}</span>
              </div>
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium">
                {domain.count}
              </div>
            </div>
          );
        })}
      </div>

      {status !== "CanLoadMore" && (
        <Button className="w-full text-sm" size="sm" disabled variant="ghost">
          <span className="flex items-center">
            Unable to load more <ChevronDown className="ml-2 h-4 w-4" />
          </span>
        </Button>
      )}

      {status === "Exhausted" && (
        <Button className="w-full text-sm" size="sm" disabled variant="ghost">
          <span className="flex items-center">
            Exhausted <ChevronDown className="ml-2 h-4 w-4" />
          </span>
        </Button>
      )}

      {status === "CanLoadMore" && (
        <Button
          className="w-full text-sm"
          size="sm"
          variant="ghost"
          onClick={() => loadMore(2)}
        >
          {!isLoading ? (
            <span className="flex items-center">
              Show more <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              Loading <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

export default AnalyticsPage;
