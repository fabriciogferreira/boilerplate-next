---
name: api
description: Consult the backend OpenAPI documentation before implementing or changing any API integration. Use when the task involves backend communication (HTTP requests, authentication, payloads, responses, routes, validations, or errors).
---

# Backend API

Consult the OpenAPI specification before implementing or changing any backend integration.

## When to Use

- Use this skill when the task involves backend communication
- This skill is useful for HTTP requests, authentication, payloads, responses, routes, validations, or errors

## Instructions

- Consult the OpenAPI documentation first, available at: http://press-play-backend:8000/docs.openapi
- Never assume an endpoint exists
- Never invent parameters or payloads
- Consult the OpenAPI specification before writing code
- Use exactly the HTTP methods, URLs, parameters, and schemas defined in the documentation
- Respect the documented response codes
- If the documentation does not contain the requested endpoint, report that it was not found instead of inventing an implementation
- Use the types returned by the documentation
- Preserve field names exactly as defined in the API
- If examples exist in the specification, follow them
- Prefer reusing existing endpoints over creating new calls
- When necessary, use the authentication scheme defined in the OpenAPI specification
- Use the ask questions tool if you need to clarify requirements with the user
