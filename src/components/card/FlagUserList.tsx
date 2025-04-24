"use client"

import React from "react"
import { Accordion } from "@/components/ui/shadcn/accordion"
import { FlagUserCard } from "./FlagUserCard"
import { User } from "@/types"

interface FlagUserListProps {
  groupedData: Map<string, Array<User>>
}

export const FlagUserList: React.FC<FlagUserListProps> = ({ groupedData }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {Array.from(groupedData.entries()).map(([jobTitle, users]) => (
        <FlagUserCard key={jobTitle} jobTitle={jobTitle} users={users} />
      ))}
    </Accordion>
  )
}
