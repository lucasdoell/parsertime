"use client";

import { AddScrimCard } from "@/components/dashboard/add-scrim-card";
import { ScrimCard } from "@/components/dashboard/scrim-card";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scrim } from "@prisma/client";
import { useState } from "react";

type Props = {
  scrims: Array<Scrim & { team: string; creator: string; hasPerms: boolean }>;
};

export function ScrimPagination({ scrims }: Props) {
  const [currPage, setCurrPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const pageSize = 15;

  // Sort scrims based on the filter
  const sortedScrims = scrims.sort((a, b) => {
    if (filter === "date-asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (filter === "date-desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0; // No sorting applied
  });

  // Filter and search logic combined
  const filteredAndSearchedScrims = sortedScrims.filter((scrim) => {
    const matchesSearch = scrim.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const pages = Math.ceil(filteredAndSearchedScrims.length / pageSize);
  const startIndex = (currPage - 1) * pageSize;
  const currentPageScrims = filteredAndSearchedScrims.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <Card>
      <span className="inline-flex p-4 gap-2">
        <Select onValueChange={(v) => setFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a filter</SelectLabel>
              <SelectItem value="date-asc">Date (Ascending)</SelectItem>
              <SelectItem value="date-desc">Date (Descending)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          type="search"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[260px]"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {currentPageScrims.map((scrim) => (
          <ScrimCard key={scrim.id} scrim={scrim} />
        ))}

        <AddScrimCard />

        <div className="col-span-full">
          {pages > 1 && (
            <Pagination>
              <PaginationContent>
                {currPage > 1 && (
                  <PaginationPrevious
                    onClick={() => setCurrPage(currPage - 1)}
                    href="#"
                  />
                )}
                {Array.from({ length: pages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrPage(index + 1)}
                      aria-label={`Go to page ${index + 1}`}
                      isActive={currPage === index + 1}
                      href="#"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {currPage < pages && (
                  <PaginationNext
                    onClick={() => setCurrPage(currPage + 1)}
                    href="#"
                  />
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </Card>
  );
}
