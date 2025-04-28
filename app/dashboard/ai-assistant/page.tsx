"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useList } from "@/hooks/use-list";
import { UnipileContext } from "@/provider/unipile-context";
import { useMutation, useQuery } from "convex/react";
import { X } from "lucide-react";
import { useContext, useEffect, useState } from "react";

const examplePrompts = [
  {
    value: "urgent",
    label: 'Label urgent emails as "Urgent"',
    content: 'Label urgent emails as "Urgent"',
  },
  {
    value: "newsletter",
    label: 'Label newletters as "Newletter" and archive them.',
    content: 'Label newletters as "Newletter" and archive them.',
  },
  {
    value: "marketing",
    label: 'Label marketing emails as "Marketing" and archive them.',
    content: 'Label marketing emails as "Marketing" and archive them.',
  },
  {
    value: "receipts",
    label: 'Label reciepts as "Reciept" and forward them to cfo@company.com',
    content: 'Label reciepts as "Reciept" and forward them to cfo@company.com',
  },
  {
    value: "cold-emails",
    label:
      "Reply to cold emails by telling them to check out EmailChef. Then move it spam.",
    content:
      "Reply to cold emails by telling them to check out EmailChef. Then move it spam.",
  },
];

const AIRulesPage = () => {
  const unipile = useContext(UnipileContext);

  const rules = useQuery(
    api.webhook.listRules,
    unipile.userId ? { userId: unipile.userId } : "skip"
  );
  const upsertRule = useMutation(api.webhook.upsertRule);

  const { items, setItems, addItem, removeItem, updateItem } = useList();

  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const handleExampleSelect = (value: string) => {
    const example = examplePrompts.find((ex) => ex.value === value);
    if (example) {
      addItem("input", example.content);
      setSelectedExample(null); // Reset selection
    }
  };

  const handleAddPrompt = () => {
    addItem("input");
  };

  const handleAddMultiLinePrompt = () => {
    addItem("textarea");
  };

  useEffect(() => {
    if (rules) {
      setItems(rules);
    }
  }, [rules]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-5">
          <div className="flex">
            <div>
              <h2 className="text-lg font-medium">
                How AI assistant should handle incoming emails.
              </h2>
              <span className="text-sm  text-muted-foreground">
                Write a prompt for the assistant to follow
              </span>
            </div>

            <div className="ml-auto flex items-center gap-x-2">
              <Select
                value={selectedExample || ""}
                onValueChange={handleExampleSelect}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an example" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {examplePrompts.map((example) => (
                      <SelectItem key={example.value} value={example.value}>
                        {example.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  const userId = unipile.userId;

                  if (userId) {
                    upsertRule({
                      userId: userId as Id<"users">,
                      rules: items.map((item) => ({
                        id: item.id,
                        value: item.value,
                        type: item.type,
                      })),
                    });
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>

          <div className="gap-y-1 flex flex-col col-span-2">
            {items &&
              items.map((item) => (
                <div key={item.id} className="flex gap-x-3 items-center">
                  {item.type === "textarea" ? (
                    <Textarea
                      placeholder="prompt here"
                      value={item.value}
                      onChange={(e) => updateItem(item.id, e.target.value)}
                    />
                  ) : (
                    <Input
                      placeholder="prompt here"
                      value={item.value}
                      onChange={(e) => updateItem(item.id, e.target.value)}
                    />
                  )}

                  <Button
                    size="icon"
                    variant="outline"
                    className="size-7"
                    onClick={() =>
                      removeItem(item.id, (filteredlist) => {
                        upsertRule({
                          userId: unipile.userId as Id<"users">,
                          rules: filteredlist,
                        });
                      })
                    }
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}

            {!items && <div>No rules to render</div>}
          </div>

          <div className="flex items-center">
            <Button size="sm" variant="outline" onClick={handleAddPrompt}>
              Add SingleLine Prompt
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleAddMultiLinePrompt}
            >
              Add MultiLine Prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRulesPage;
