---
name: schema
description: Create or edit the project's data schemas. Use when it is necessary to define or modify the structure of the data.
---

# Schema

Define and organize data schemas following the project's directory structure.

## When to Use

- Use this skill when it is necessary to define or modify the structure of the data
- This skill is useful when creating or changing models, bases, and relationships in the schemas

## Instructions

- Follow the directory structure:

```
app/
  schemas/
    bases/ -> holds the base of each model, without the relationship columns
    foreigners/ -> holds the imported base of each model together with the relationship columns
    {model}.ts -> holds the model's schema definition, including the relationship columns
```

- Put the base of each model (without relationships) in `bases/`
- Put the base with relationship columns in `foreigners/`
- Define the model's complete schema in `{model}.ts`
- Eloquent class strings (`App\Models\…`) live only in `modelEnum` (`src/schemas/models.ts`). Do not write `"App\\Models\\…"` in a schema, hook, page, or component. Add the model to `modelEnum`, derive `modelSchema` / `.extract()`, and import `modelEnum` from `@/schemas`
- Use the ask questions tool if you need to clarify requirements with the user
