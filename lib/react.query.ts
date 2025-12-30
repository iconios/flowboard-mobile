import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5mins
      gcTime: 10 * 60 * 1000, // 10mins cache time
    },
    mutations: {
      retry: 1,
    },
  },
});
