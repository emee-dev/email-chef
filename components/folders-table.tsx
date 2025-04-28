"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { type UniqueIdentifier } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMutation } from "convex/react";
import {
  AlertCircle,
  Archive,
  ArrowUpDown,
  Bell,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  Edit2,
  Folder,
  Inbox,
  Mail,
  MessageSquare,
  Save,
  Send,
  ShoppingBag,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

type EditingState = { state: boolean; id: string };

function getFolderColumns(
  folders: Folder[],
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>,
  isEditing: EditingState,
  setIsEditing: React.Dispatch<React.SetStateAction<EditingState>>
): ColumnDef<Folder>[] {
  return [
    {
      accessorKey: "icon",
      header: "",
      cell: ({ row }) => {
        const folder = row.original;
        const Icon = getFolderIcon(folder.name);
        return <Icon className="h-5 w-5 text-muted-foreground" />;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-x-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const folder = row.original;

        const handleCancel = () => {
          setIsEditing({ state: false, id: "" });
        };

        return (
          <div className="flex items-center gap-2">
            {isEditing.id === folder.id && isEditing.state ? (
              <>
                <Input
                  value={folder.description}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFolders(
                      folders.map((f) =>
                        f.id === folder.id ? { ...f, description: value } : f
                      )
                    );
                  }}
                  className="h-8"
                  autoFocus
                />
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <div className="border rounded-md px-3 py-1.5 flex-1 text-sm bg-muted/30">
                  {folder.description || "No description"}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing({ state: true, id: folder.id })}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];
}

export type Folder = {
  id: string;
  name: string;
  description?: string;
};

export function FolderTable({
  data,
  userId,
}: {
  data: Folder[] | undefined;
  userId: string;
}) {
  const [folders, setFolders] = useState<Folder[]>(data || []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isEditing, setIsEditing] = useState<EditingState>({
    state: false,
    id: "",
  });

  const upsertFolder = useMutation(api.webhook.upsertFolders);

  const columns = React.useMemo(() => {
    return getFolderColumns(folders, setFolders, isEditing, setIsEditing);
  }, [folders, setFolders, isEditing, setIsEditing]);

  const handleSave = () => {
    upsertFolder({
      userId: userId as Id<"users">,
      folders: folders.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
      })),
    });
    setIsEditing({ state: false, id: "" });
  };

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data: folders,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      defaultValue="outline"
      className="flex w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Hide</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className={row.getIsExpanded() ? "bg-muted/30" : ""}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

function getFolderIcon(role: string) {
  switch (role.toLowerCase()) {
    case "inbox":
      return Inbox;
    case "sent":
      return Send;
    case "drafts":
      return Mail;
    case "trash":
      return Trash2;
    case "spam":
      return AlertCircle;
    case "starred":
      return Star;
    case "important":
      return Bell;
    case "archive":
      return Archive;
    case "social":
    case "unknown": // For CATEGORY_SOCIAL
      return Users;
    case "promotions": // For CATEGORY_PROMOTIONS
      return ShoppingBag;
    case "chat":
      return MessageSquare;
    default:
      return Folder;
  }
}
