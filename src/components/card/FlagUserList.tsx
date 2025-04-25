"use client";

import { Accordion } from "@/components/ui/shadcn/accordion";
import { User } from "@/types";
import React from "react";
import { FlagUserCard } from "./FlagUserCard";

interface JobListingGroup {
  jobTitle: string;
  jobListingId: string;
  users: Array<User>;
}

interface FlagUserListProps {
  groupedData: Array<JobListingGroup>;
}

export const FlagUserList: React.FC<FlagUserListProps> = ({ groupedData }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {groupedData.map(({ jobTitle, jobListingId, users }) => (
        <FlagUserCard
          key={jobListingId}
          jobTitle={jobTitle}
          jobListingId={jobListingId}
          users={users}
        />
      ))}
    </Accordion>
  );
};
