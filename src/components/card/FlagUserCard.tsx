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
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Star } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface FlagUserCardProps {
  jobTitle: string;
  users: Array<User>;
  jobListingId: string;
}

interface Flag {
  _id: string;
  jobListing: string;
  user: string;
}

export const FlagUserCard: React.FC<FlagUserCardProps> = ({
  jobTitle,
  users,
  jobListingId,
}) => {
  const queryClient = useQueryClient();

  // Fetch flags for this job listing
  const { data: flags } = useQuery({
    queryKey: [BackendRoutes.FLAGS, jobListingId],
    queryFn: async () => {
      const response = await axios.get<{ success: boolean; data: Array<Flag> }>(
        BackendRoutes.FLAGS,
        {
          params: { jobListing: jobListingId },
        },
      );
      console.log("Fetched flags:", {
        jobListingId,
        flags: response.data.data,
      });
      return response.data.data;
    },
  });

  const { mutate: unflagUser, isPending: isUnflagging } = useMutation({
    mutationFn: async (userId: string) => {
      console.log("Trying to unflag user:", {
        userId,
        jobListingId,
        availableFlags: flags,
      });

      // Find the flag ID for this user and job listing
      const flag = flags?.find((f) => {
        const userMatch = String(f.user) === String(userId);
        const jobMatch = String(f.jobListing) === String(jobListingId);
        console.log("Comparing flag:", {
          flag: f,
          userId,
          jobListingId,
          userMatch,
          jobMatch,
        });
        return userMatch && jobMatch;
      });

      console.log("Found flag:", flag);

      if (!flag) {
        throw new Error("Flag not found");
      }
      await axios.delete(BackendRoutes.FLAGS_ID({ id: flag._id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BackendRoutes.COMPANIES_ID_SESSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [BackendRoutes.FLAGS],
      });
      toast.success("User unflagged successfully");
    },
    onError: (error) => {
      console.error("Failed to unflag user:", error);
      toast.error("Failed to unflag user. Please try again.");
    },
  });

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
          {users.map((user, index) => {
            const userFlag = flags?.find(
              (f) => String(f.user) === String(user.id),
            );
            const isFlagged = !!userFlag;

            return (
              <div
                key={index}
                className="group relative flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100"
              >
                {/* User info with conditional star */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isFlagged && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <p
                      className={`font-medium ${isFlagged ? "text-yellow-600" : "text-gray-900"}`}
                    >
                      👤 {user.name}
                    </p>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>📧 {user.email}</p>
                    <p>📞 {user.tel}</p>
                  </div>
                </div>

                {/* Dropdown menu */}
                <div className="ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="rounded-full p-1.5 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                        disabled={isUnflagging}
                      >
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
                      {isFlagged && (
                        <DropdownMenuItem
                          onSelect={() => {
                            console.log("Unflagging user:", {
                              userId: user.id,
                              name: user.name,
                              jobListingId,
                              flag: userFlag,
                            });
                            unflagUser(user.id);
                          }}
                          disabled={isUnflagging}
                          variant="destructive"
                          className="text-sm text-red-600"
                        >
                          {isUnflagging ? "Unflagging..." : "Unflag"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
