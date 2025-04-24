import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { User } from "@/types";
import { MoreVertical } from "lucide-react";
import React from "react";

interface FlagUserCardProps {
  jobTitle: string;
  users: Array<User>;
}

export const FlagUserCard: React.FC<FlagUserCardProps> = ({
  jobTitle,
  users,
}) => {
  return (
    <AccordionItem
      value={jobTitle}
      className="w-full rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="w-full text-left">
          <h3 className="text-lg font-semibold text-gray-900">{jobTitle}</h3>
        </div>
      </AccordionTrigger>

      <AccordionContent className="border-t border-gray-100 px-6 py-4">
        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="relative rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100"
            >
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full p-1.5 text-gray-500 hover:bg-white">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onSelect={() => alert(`Chat with ${user.name}`)}
                      className="text-sm"
                    >
                      Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => alert(`Unflag ${user.name}`)}
                      variant="destructive"
                      className="text-sm text-red-600"
                    >
                      Unflag
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* User info */}
              <div className="space-y-2 pr-8">
                <p className="font-medium text-gray-900">👤 {user.name}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📧 {user.email}</p>
                  <p>📞 {user.tel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
