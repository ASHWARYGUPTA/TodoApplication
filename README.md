# Todo Application

A simple Todo application for creating, tracking, and completing daily tasks.

## Features

- Add new todo items
- Mark todo items as complete
- Review active and completed tasks
- Keep the interface focused on quick task entry
- Use a lightweight structure that can be extended with persistence later

## Suggested Data Schema

The app can represent each todo item with the following shape:

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": false,
  "createdAt": "2026-05-12T00:00:00.000Z",
  "updatedAt": "2026-05-12T00:00:00.000Z"
}
```

If a relational database is added, the same data can be stored in a `todos` table:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | UUID or text | Unique todo identifier |
| `title` | text | Required task title |
| `description` | text | Optional task details |
| `completed` | boolean | Completion status |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last update time |

## Project Notes

This repository is a starter Todo app and can be extended with authentication, filtering, due dates, local storage, or a backend API.
