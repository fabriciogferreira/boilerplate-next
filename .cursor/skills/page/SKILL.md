---
name: page
description: Create or edit pages following the project's layout and routing conventions. Use when it is necessary to define or modify the structure of pages.
---

# Page

Create or edit pages respecting the separation between authenticated and unauthenticated routes.

## When to Use

- Use this skill when it is necessary to define or modify the structure of pages
- This skill is useful when creating internal pages (login required) or external pages (public access)

## Instructions

- Internal pages mean the user must be logged in to access them, while external pages can be accessed by anyone
- Internal pages must be created inside the `(authenticated)` folder and external pages inside the `(unauthenticated)` folder
- Define the page layout using the `definePageMeta` function:

```typescript
definePageMeta({
	layout: 'unauthenticated'
})
```

- Follow the directory structure:

```
app/
  pages/
    (unauthenticated)/
    (authenticated)/
```

- Use the ask questions tool if you need to clarify requirements with the user
