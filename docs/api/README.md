# API Documentation

## Overview

The API types are organized in a versioned structure under `src/types/api/`. The API uses a consistent response format and includes pagination support. The types are organized by HTTP method (GET, POST, etc.) in separate `.d.ts` files.

## Base Types

### DefaultResponse

All API responses follow this base structure:

```typescript
interface DefaultResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
```

### Pagination

For paginated responses, the following types are used:

```typescript
interface Pagination {
  page: number;
  limit: number;
}

interface WithPagination {
  count: number;
  pagination: {
    next?: Pagination;
    prev?: Pagination;
  };
}
```

## Generic Types

The codebase includes several utility types for type safety and composition:

```typescript
// Makes a type nullable
type Nullable<T> = T | null;

// Combines two types
type Combine<A, B> = A & B;
```

## API Versioning

The API types are organized by version under `src/types/api/v1/` with the following structure:

- `auth/` - Authentication related types
  - `me/GET.d.ts` - Get current user
  - `login/POST.d.ts` - Login endpoint
- `companies/` - Company related types
  - `GET.d.ts` - Get all companies
- `sessions/` - Session related types
  - `GET.d.ts` - Get all sessions
- `users/` - User related types
  - `GET.d.ts` - Get all users

## Type Naming Convention

API types follow a consistent naming pattern:

- Request types: `<METHOD><Resource>Request`
- Response types: `<METHOD><Resource>Response`
- List response types: `<METHOD>All<Resource>Response`

## Usage Example

```typescript
// Example of using the DefaultResponse with pagination
interface GETAllCompaniesResponse
  extends WithPagination,
    DefaultResponse<Array<Company>> {}

// Example API call using axios
const response = await axios.get<GETAllCompaniesResponse>(
  BackendRoutes.COMPANIES,
  {
    params: { page: 1, limit: 10 },
  },
);

if (response.data.success) {
  const { data: companies, count, pagination } = response.data;
  // Handle paginated company data
}
```

## Note

This documentation will be updated once the backend team provides the complete `.d.ts` files for all API endpoints. The current structure is based on the existing frontend implementation and may be subject to change.
