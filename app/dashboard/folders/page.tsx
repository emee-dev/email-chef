"use client";

import { FolderTable } from "@/components/folders-table";
import { api } from "@/convex/_generated/api";
import { UnipileContext } from "@/provider/unipile-context";
import { useQuery } from "convex/react";
import React, { useContext } from "react";

type Folder = {
  object: "Folder";
  id: string;
  name: string;
  account_id: string;
  role: string;
  status: string;
  nb_mails: number;
  provider_id: string;
};

type FolderListObject = {
  object: "FolderList";
  items: Folder[];
};

const FolderList: React.FC = () => {
  const unipile = useContext(UnipileContext);

  const labelledFolders = useQuery(
    api.webhook.listFolders,
    unipile.userId ? { userId: unipile.userId } : "skip"
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="px-4 py-3">
          <h2 className="text-lg font-medium">Folders</h2>
          <span className="text-sm  text-muted-foreground">
            Describe your folders for the AI.
          </span>
        </div>

        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <FolderTable data={labelledFolders} userId={unipile.userId} />
        </div>
      </div>
    </div>
  );
};

export default FolderList;
