interface InterviewSessionCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const SessionCard: React.FC<InterviewSessionCardProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="border-input flex w-full flex-col gap-3 rounded-sm border-1 p-4">
      <div className="flex flex-col">
        <h1 className="text-md font-bold">{title}</h1>
        <p className="text-sm">{description}</p>
      </div>

      {children ? <div className="flex flex-col">{children}</div> : null}
    </div>
  );
};
