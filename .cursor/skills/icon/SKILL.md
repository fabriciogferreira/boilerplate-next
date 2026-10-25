---
name: icon
description: Add icons in components/icons.tsx and export them under a meaningful name. Use when it is necessary to create, add, import, or use icons (lucide, SVG, icon buttons, or any icon in the UI).
---

# Icon

Add icons in `components/icons.tsx` and export them under a meaningful name.

## When to Use

- Use this skill when it is necessary to create, add, or use an icon
- This skill is useful when implementing buttons, menus, actions, or any visual element that needs an icon

## Instructions

- Add icons in `components/icons.tsx`
- Export under a name that makes sense for use in the project, not the raw library name
- Import icons only from `@/components/icons`, never directly from `lucide-react` in components
- Reuse an existing export before adding a new icon
- Import the icon from `lucide-react`, assign it to a constant named after the domain, and export that constant

```typescript
import {
	PlusIcon,
	PenIcon,
	Trash2Icon,
} from "lucide-react"

const AddIcon = PlusIcon
const EditIcon = PenIcon
const DropIcon = Trash2Icon

export {
	AddIcon,
	EditIcon,
	DropIcon,
}
```

- Use the ask questions tool if you need to clarify requirements with the user
