# PaymentLab frontend

A standalone React application. All application code, components, shared models, utilities, and Vite configuration use strict TypeScript (`.ts` / `.tsx`). The HTML entry point and CSS stylesheet remain standard web assets. The ASP.NET Core API is a separate service.

## Run locally

From this directory:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. Start the API in a separate terminal from the repository root:

```sh
dotnet run --project src/PaymentLab.Api
```

Vite proxies `/accounts` and `/transfers` to http://localhost:5080. To use another API address, copy `.env.example` to `.env.local`, update `PAYMENTLAB_API_TARGET`, and restart Vite. This variable configures the development server and local preview; it is not a browser environment variable.

## Check and build

```sh
npm run typecheck
npm run build
npm run preview
```

The production build is written only to `frontend/dist/`. Preview it at http://localhost:4173 with the API running. Frontend builds do not write into the API project.

For deployment, serve `dist/` from a static web host and configure its reverse proxy to forward `/accounts` and `/transfers` (including account ID paths) to the API. Vite's local proxy is not included in the static production bundle. API data remains in memory, and transfer history in the interface lasts for the current page session.

## Module structure

```text
src/
  main.tsx                  React entry point
  App.tsx                   Workspace composition
  api/
    client.ts               HTTP requests and error handling
    payments.ts             Typed account and transfer endpoints
  components/
    AccountsPanel.tsx
    ActivityPanel.tsx
    CreateAccountDialog.tsx
    Icon.tsx
    Sidebar.tsx
    SummaryCards.tsx
    TransferPanel.tsx
  hooks/
    usePaymentLab.ts         State, derived data, and actions
  types/
    payment.ts              API models, request payloads, and view types
  utils/
    exportActivity.ts       CSV export
    format.ts               Display formatting
  styles.css                Responsive styles
vite.config.ts              Development, preview, and build configuration
```

Components receive typed props selected from the workspace model. HTTP access stays in `api/`; state and workflow behavior stay in the hook. `main.tsx` only mounts the application.
