---
trigger: model_decision
description: when writing react code specailly in frost or vrp-fullstack project or directry
---

Use Tanstack Query V5 for Api call on frontend.
Use shadcn components on frontend.
Give Compact and Precise Response.
Dont use emojis.
Dont use comments it the code.
Write moduler code breakdown code in different folders like components, services, utils, constants, types.
Use TypeScript .
write resposive design and write dark mode classes also.

## UI Conventions & Robustness
- **Standard Default Actions**: Always wire up standard UI components with their expected default actions. For instance, **Back Buttons** must be explicitly wired to `onClick={() => navigate('/previous-route')}` via React Router's `useNavigate` to ensure they function appropriately.
- **Refactoring Safety**: When modifying or reverting code, always double-check that critical UI elements, standard React hooks (like `useNavigate`, `useQuery`), and components (like `Button`) are not accidentally un-imported or disconnected.