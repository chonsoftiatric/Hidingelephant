"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ExploreFilter = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortBy = params.get("sortBy") || "latest";
  const current = new URLSearchParams(Array.from(params.entries()));
  const handleSortBy = (val: string) => {
    if (val === "latest") {
      // remove the searchParam sortBY
      current.delete("sortBy");
    } else {
      current.set("sortBy", val);
    }
    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };
  return (
    <div>
      <Select value={sortBy} onValueChange={(val: string) => handleSortBy(val)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="most-liked">Most Liked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
