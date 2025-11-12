# AI Development Rules for Stof AI Song Creator

This document outlines the rules and guidelines for developing the Stof AI Song Creator application. Adhering to these rules ensures consistency, maintainability, and efficient development.

## 🚀 Tech Stack

*   **Framework:** Next.js 14 (React Framework)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** React Context API (for simpler state) / Zustand (for more complex global state)
*   **HTTP Client:** Axios
*   **Icons:** Lucide React
*   **UI Components:** Shadcn/ui (built on Radix UI and Tailwind CSS)
*   **API Interaction:** Fetch API (for simple client-side requests) / Axios (for more complex requests or when interceptors are needed)
*   **Deployment:** Docker, Vercel, Dokploy compatible

## 📜 Library Usage Rules

### 1. Core Framework & Language
*   **Next.js:** Utilize Next.js features like Server Components, Client Components, Routing, and API Routes as appropriate.
*   **TypeScript:** All new code must be written in TypeScript. Use strong typing for props, state, and API responses.

### 2. Styling
*   **Tailwind CSS:** Use Tailwind CSS for all styling. Apply utility classes directly in JSX. Avoid writing custom CSS unless absolutely necessary (e.g., complex animations not achievable with Tailwind).
*   **Shadcn/ui:** Prefer Shadcn/ui components for common UI elements (buttons, inputs, modals, etc.). These components are pre-configured with Tailwind CSS and accessibility best practices. Do not modify the source files of Shadcn/ui components directly; create wrapper components if customization is needed.
*   **Global CSS:** Use `src/app/globals.css` for global styles, Tailwind base/components/utilities, and custom keyframe animations.

### 3. State Management
*   **React Context API:** Use for state that needs to be shared across a limited part of the component tree.
*   **Zustand:** Use for global application state that is accessed by many components (e.g., user authentication status, global settings). Keep Zustand stores small and focused.

### 4. API Requests
*   **Axios:** Use Axios for all API requests, both client-side and server-side (in API routes). Configure Axios instances with base URLs, interceptors (for error handling, auth tokens), and timeouts.
*   **Fetch API:** Can be used for very simple, one-off client-side requests where Axios overhead is not needed.

### 5. Components & Icons
*   **Lucide React:** Use Lucide React for icons. Import icons directly and use them as components.
*   **Component Structure:** Create new components in the `src/components/` directory. Keep components small and focused (ideally under 100 lines of code).

### 6. Utility Functions
*   **Native JavaScript/TypeScript:** Prefer native methods (e.g., array methods like `map`, `filter`, `reduce`) over utility libraries when they provide a clear and concise solution.
*   **Lodash:** Can be used for more complex utility operations if native methods become cumbersome, but aim for minimal dependency.

### 7. Error Handling
*   **Toasts:** Use a toast notification system (if implemented) to inform users about errors or important events.
*   **API Routes:** Implement basic error handling in API routes, returning appropriate HTTP status codes and error messages. Avoid overly complex try-catch blocks unless necessary for specific recovery logic.

### 8. Code Formatting & Linting
*   **ESLint & Prettier:** Ensure all code adheres to the project's ESLint and Prettier configurations. Run linters and formatters regularly.

### 9. PWA & Service Workers
*   **Service Workers:** Use for PWA features like offline support and caching. Ensure the service worker is registered correctly and managed according to best practices.

### 10. Dependencies
*   **Minimize Dependencies:** Only add new dependencies if they are essential and provide significant value. Check if existing libraries can fulfill the requirement.
*   **Update Dependencies:** Regularly update dependencies to their latest stable versions to benefit from security patches and new features.

---
## 🤝 Contribution Guidelines

*   Follow these rules strictly.
*   If unsure about a rule, consult with the lead developer or team.
*   New libraries or significant changes to the tech stack require team approval.