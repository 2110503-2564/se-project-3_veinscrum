# UI Components Documentation

## Overview

The application uses shadcn/ui components and custom components to create a consistent and modern user interface. shadcn/ui is a collection of reusable components built using Radix UI and Tailwind CSS.

## Installing New shadcn Components

To add new shadcn components to your project, use the following command:

```bash
pnpm dlx shadcn-ui@latest add <component-name>
```

For example, to add a new button component:

```bash
pnpm dlx shadcn-ui@latest add button
```

You can find all available components and their documentation at [shadcn/ui's official website](https://ui.shadcn.com/docs/components).

## Component Locations

- shadcn components: `src/components/ui/shadcn/`
- Custom components: `src/components/ui/shadcn/custom/`

## Sonner Toast

The application uses Sonner for toast notifications. To use toast notifications:

```typescript
import { toast } from "sonner";

// Success toast
toast.success("Operation completed successfully");

// Error toast
toast.error("Something went wrong");

// Custom toast
toast("Custom message", {
  description: "Additional details here",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

## Usage Example

```typescript
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { toast } from 'sonner';

export function LoginForm() {
  return (
    <form>
      <Input type="email" placeholder="Email" />
      <Button
        onClick={() => toast.success('Logged in successfully')}
      >
        Login
      </Button>
    </form>
  );
}
```
