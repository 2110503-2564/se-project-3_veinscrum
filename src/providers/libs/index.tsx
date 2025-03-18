import { SessionProvider } from "next-auth/react";
import { LibProvidersProps } from "..";
import { SonnerToastProvider } from "./SonnerToastProvider";
import { TanstackQueryProvider } from "./TanstackQueryProvider";

export const LibProviders: React.FC<LibProvidersProps> = ({ children }) => (
  <SessionProvider>
    <TanstackQueryProvider>
      <SonnerToastProvider>{children}</SonnerToastProvider>
    </TanstackQueryProvider>
  </SessionProvider>
);
