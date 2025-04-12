# Hooks Documentation

## Overview

The application uses a combination of React Query hooks (useMutation, useQuery) and custom hooks for data fetching and state management. All API calls are made using the configured axios instance from `@/lib/axios`.

## React Query Hooks

### useQuery

Used for fetching data from the API. Example:

```typescript
import { useQuery } from "@tanstack/react-query";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";

// Fetching companies
const { data, isLoading } = useQuery({
  queryKey: [BackendRoutes.COMPANIES],
  queryFn: async () =>
    await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES),
});

// Fetching a single company
const { data: company } = useQuery({
  queryKey: [BackendRoutes.COMPANIES_ID({ id })],
  queryFn: async () =>
    await axios.get<GETCompanyResponse>(BackendRoutes.COMPANIES_ID({ id })),
});
```

### useMutation

Used for modifying data through the API. Example:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";

// Creating a company
const { mutate } = useMutation({
  mutationFn: (data: CreateCompanyRequest) =>
    axios.post<CreateCompanyResponse>(BackendRoutes.COMPANIES, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [BackendRoutes.COMPANIES] });
  },
});
```

## Custom Hooks

### usePagination

Located in `src/hooks/usePagination.tsx`
A custom hook for managing pagination state:

```typescript
const { page, limit, setPage, setLimit, getQuery } = usePagination({
  defaultPage: 1,
  defaultLimit: 10,
});
```

## Best Practices

1. **Query Keys**

   - Use `BackendRoutes` enum for query keys to maintain consistency
   - Include all dependencies in the query key array
   - Example: `[BackendRoutes.COMPANIES, getQuery()]`

2. **API Calls**

   - Always use the configured axios instance from `@/lib/axios`
   - The axios instance automatically handles authentication and base URL
   - Use `BackendRoutes` enum for all API endpoints
   - Always specify response types for GET requests: `axios.get<ResponseType>`
   - Always specify request and response types for POST/PUT/DELETE: `axios.post<ResponseType, RequestType>`

3. **Mutations**

   - Always invalidate relevant queries after successful mutations
   - Handle loading and error states
   - Use optimistic updates when appropriate

4. **Error Handling**
   - Implement proper error boundaries
   - Use toast notifications for user feedback
   - Log errors for debugging

## Example Usage

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { usePagination } from '@/hooks/usePagination';
import { BackendRoutes } from '@/constants/routes/Backend';
import { axios } from '@/lib/axios';
import { toast } from 'sonner';

export function CompanyList() {
  const { page, limit, setPage, getQuery } = usePagination();

  const { data, isLoading } = useQuery({
    queryKey: [BackendRoutes.COMPANIES, getQuery()],
    queryFn: async () => await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES, {
      params: getQuery()
    })
  });

  const { mutate } = useMutation({
    mutationFn: (data: CreateCompanyRequest) =>
      axios.post<CreateCompanyResponse>(BackendRoutes.COMPANIES, data),
    onSuccess: () => {
      toast.success('Company created successfully');
      queryClient.invalidateQueries({ queryKey: [BackendRoutes.COMPANIES] });
    },
    onError: (error) => {
      toast.error('Failed to create company');
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data.companies.map(company => (
        <CompanyCard key={company.id} company={company} />
      ))}
      <Pagination
        page={page}
        onPageChange={setPage}
        totalPages={data.totalPages}
      />
    </div>
  );
}
```
