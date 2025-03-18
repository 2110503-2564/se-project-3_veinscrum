import { Toaster } from "sonner";
import { LibProvidersProps } from "..";

export const SonnerToastProvider: React.FC<LibProvidersProps> = ({
  children,
}) => {
  return (
    <>
      <Toaster richColors />
      {children}
    </>
  );
};
