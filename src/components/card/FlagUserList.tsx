"use client";

import React from "react";
import { FlagUserCard } from "./FlagUserCard";

interface FlagUserListProps {
  groupedData: Map<string, Array<InterviewSession>>;
}

export const FlagUserList: React.FC<FlagUserListProps> = ({ groupedData }) => {
  return (
    <div className="w-full space-y-4">
      {Array.from(groupedData.entries()).map(([_, interviewSessions], idx) => (
        <FlagUserCard key={idx} interviewSessions={interviewSessions} />
      ))}
    </div>
  );
};
