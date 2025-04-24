import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { User } from "@/types";
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
            className="mb-2 rounded-md border bg-gray-50 p-4 text-xl"
          >
            <p className="font-semibold">👤 {user.name}</p>
            <p>📧 {user.email}</p>
            <p>📞 {user.tel}</p>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
