import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import React from "react";

interface InterviewSessionCardWithDropdownProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  dropdownContent?: React.ReactElement<typeof DropdownMenuContent>;
  topRightElement?: React.ReactElement;
}

export const InterviewSessionCardWithDropdown: React.FC<
  InterviewSessionCardWithDropdownProps
> = ({ title, description, children, dropdownContent, topRightElement }) => {
  return (
    <div className="border-input flex w-full justify-between rounded-sm border-1 p-4">
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col">
          <h1 className="text-md font-bold">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>

        {children ? (
          <div className="flex flex-col gap-1">{children}</div>
        ) : null}
      </div>

      <div className="flex flex-col items-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-fit w-fit rounded-full p-2 transition-colors hover:bg-slate-100 focus:outline-none">
              <EllipsisIcon />
            </button>
          </DropdownMenuTrigger>
          {dropdownContent || <DropdownMenuContent />}
        </DropdownMenu>

        {topRightElement && topRightElement}
      </div>
    </div>
  );
};
