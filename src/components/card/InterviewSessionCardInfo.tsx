import { LucideIcon } from "lucide-react";

interface InterviewSessionCardInfoProps {
  icon: LucideIcon;
  text: string;
}

export const InterviewSessionCardInfo: React.FC<
  InterviewSessionCardInfoProps
> = ({ icon: Icon, text }) => {
  return (
    <div className="flex gap-1">
      <Icon className="h-4 w-4 text-slate-500" />
      <p className="text-xs text-slate-500">{text}</p>
    </div>
  );
};
