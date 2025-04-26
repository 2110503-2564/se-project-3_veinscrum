import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/CustomButton";

// FlagButton.tsx
export const FlagButton: React.FC<{
  starred: boolean;
  disabled?: boolean;
  setStarred: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ starred, disabled = false, setStarred }) => {
  return (
    <Button
      variant="ghost"
      disabled={disabled}
      className="h-fit rounded-full p-1"
      onClick={() => setStarred((prev) => !prev)}
    >
      <StarIcon
        size={16}
        className={cn(
          "transition-all",
          starred && "fill-yellow-400 text-yellow-400",
        )}
      />
    </Button>
  );
};
