"use client";

import { useEffect, useState } from "react";

export type ListItem = {
  id: string;
  value: string;
  type: "textarea" | "input";
};

export function useList(/* initialItems: ListItem[] */) {
  const [items, setItems] = useState<ListItem[]>([]);

  // Update the addItem function to accept an optional content parameter
  const addItem = (type: "textarea" | "input" = "input", value = "") => {
    const newItem: ListItem = {
      id: crypto.randomUUID(),
      value,
      type,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string, cb: (data: ListItem[]) => void) => {
    const filteredList = items.filter((item) => item.id !== id);
    cb(filteredList);
    setItems(filteredList);
  };

  const updateItem = (id: string, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, value } : item)));
  };

  return {
    items,
    addItem,
    setItems,
    removeItem,
    updateItem,
  };
}
