"use client";

import { Badge } from "@/components/ui/badge";

// import { Badge } from "lucide-react";

const FilterPage = () => {
  const selectedTags = ["Netflex", "Youtube Premium"];

  const clearTagFilter = () => {};

  return (
    <div className="px-3 pt-5">
      <div>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-md">
            <span className="text-sm text-blue-700">Filtering by tag:</span>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 hover:bg-blue-100"
            >
              {selectedTags[0]}
            </Badge>
            <button
              onClick={clearTagFilter}
              className="text-sm text-blue-600 hover:underline ml-auto"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
