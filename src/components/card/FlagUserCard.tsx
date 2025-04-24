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
    <AccordionItem value={jobTitle}>
      <AccordionTrigger>
        <div className="text-2xl">{jobTitle}</div>
      </AccordionTrigger>

      <AccordionContent>
        {users.map((user, index) => (
          <div
            key={index}
            className="relative mb-2 rounded-md border bg-gray-50 p-4 text-xl"
          >
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md p-1 hover:bg-gray-200">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-28">
                  <DropdownMenuItem
                    onSelect={() => alert(`Chat with ${user.name}`)}
                  >
                    Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => alert(`Unflag ${user.name}`)}
                    variant="destructive"
                  >
                    Unflag
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User info */}
            <p className="font-semibold">👤 {user.name}</p>
            <p>📧 {user.email}</p>
            <p>📞 {user.tel}</p>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
