---
name: index
description: Every folder must have an index.ts to export its features. Use when creating, moving, or editing folders, modules, components, or TypeScript/TSX files that need to be imported.
---

# Index

Every folder must have an index.ts to export its features.

## When to Use

- Use this skill when creating or changing a folder, module, or exportable file
- This skill is useful when adding components, icons, hooks, schemas, or any feature to a folder

## Instructions

- Every folder must have an `index.ts` that exports its features
- When creating a new file, export it in the folder's `index.ts`
- When creating a new folder, create its `index.ts` and re-export it in the parent folder's `index.ts`
- Import through the folder (`@/components`, `@/components/buttons`), not the inner file
- Follow the `components/` example: `buttons` (folder) and `icons` (file) are re-exported in the folder's `index.ts`

```typescript
// components/buttons/index.ts
export { ButtonAdd } from "./add"
export { ButtonCopy } from "./copy"
export { ButtonDrop } from "./drop"
export { ButtonEdit } from "./edit"
export { ButtonSubmit } from "./submit"
```

```typescript
// components/index.ts
export * from "./buttons"
export * from "./icons"
```

- Use the ask questions tool if you need to clarify requirements with the user
