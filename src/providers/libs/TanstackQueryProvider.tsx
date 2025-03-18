"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LibProvidersProps } from "..";

export const TanstackQueryProvider: React.FC<LibProvidersProps> = (props) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient} {...props} />;
};
