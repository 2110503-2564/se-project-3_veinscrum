import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import React from "react";
import { Skeleton } from "../ui/shadcn/skeleton";

export const FlagUserCardSkeleton: React.FC = () => {
  return (
    <Accordion type="single" collapsible disabled>
      <AccordionItem
        value=""
        className="w-full rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="w-full text-left">
            <Skeleton className="h-7 w-56"></Skeleton>
          </div>
        </AccordionTrigger>
      </AccordionItem>
    </Accordion>
  );
};
