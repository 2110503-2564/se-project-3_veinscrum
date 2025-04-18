# Routing Documentation

## Overview

The application uses a type-safe routing system with two main route enums: `FrontendRoutes` and `BackendRoutes`. These enums are used to maintain consistent routing throughout the application.

## Components

### Frontend Routes

Located in `src/constants/routes/Frontend.ts`, these routes define all client-side navigation paths:

- Basic routes (e.g., `/`, `/profile`)
- Authentication routes (e.g., `/auth/signin`, `/auth/signup`)
- Company-related routes (e.g., `/company`, `/company/{id}`)
- Session-related routes (e.g., `/session`, `/session/create`)
- Admin routes (e.g., `/admin/sessions`, `/admin/companies`)

### Backend Routes

Located in `src/constants/routes/Backend.ts`, these routes define all API endpoints:

- Authentication endpoints (e.g., `/auth/login`, `/auth/register`)
- Resource endpoints (e.g., `/companies`, `/sessions`)
- User-related endpoints (e.g., `/users`, `/users/{id}/sessions`)

## Usage

### Basic Route Usage

```typescript
import { FrontendRoutes } from "@/constants/routes/Frontend";
import Link from "next/link";

// Static route
<Link href={FrontendRoutes.HOME}>Home</Link>

// Dynamic route with parameters
<Link href={FrontendRoutes.COMPANY_PROFILE({ id: "123" })}>Company Profile</Link>
```

### Backend API Calls

#### Server-Side Rendering (SSR)

```typescript
import { BackendRoutes } from "@/constants/routes/Backend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";

// Making an API call with fetch (SSR)
const response = await fetch(withBaseRoute(BackendRoutes.AUTH_LOGIN), {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});
```

#### Client-Side Rendering (CSR)

```typescript
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";

// Making an API call with axios (CSR)
// Note: axios instance is pre-configured with base URL and auth token handling
const response = await axios.post(BackendRoutes.AUTH_LOGIN, {
  email,
  password,
});
```

### Route Validation

The system includes a `validateRoute` utility to check if a given path matches any defined routes:

```typescript
import { validateRoute } from "@/utils/routes/validateRoute";

const isValid = validateRoute("/company/123", FrontendRoutes);
```

## Type Safety

The routing system is fully type-safe:

- Route parameters are type-checked at compile time
- Dynamic routes with parameters return functions that require the correct parameter types
- Route handlers are generated using TypeScript utility types to ensure type safety

## Best Practices

1. Always use the route constants instead of hardcoding paths
2. Use the appropriate route type (Frontend/Backend) for the context
3. For dynamic routes, always provide the required parameters
4. Use `withBaseRoute` when making backend API calls
5. Validate routes when handling dynamic paths
